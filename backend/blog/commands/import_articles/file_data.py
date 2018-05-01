import frontmatter
import os
import re
import tzlocal

from flask_unchained import unchained, injectable

from backend.utils import timestamp_to_datetime

from ...config import Config
from ...services import CategoryManager, TagManager

DATE_RE = re.compile(r'^(?P<date>\d{4}-\d{2}-\d{2})')
PART_RE = re.compile(r'^(\d{4}-\d{2}-\d{2}-)?(part-)?(?P<part>\d+)', re.IGNORECASE)


@unchained.inject('category_manager', 'tag_manager')
class FileData(object):
    def __init__(self, dir_entry: os.DirEntry,
                 category_manager: CategoryManager = injectable,
                 tag_manager: TagManager = injectable):
        self.category_manager = category_manager
        self.tag_manager = tag_manager

        self.file_path = dir_entry.path
        self.file_name = dir_entry.name
        self.is_dir = self.file_name in [Config.ARTICLE_FILENAME,
                                         Config.SERIES_FILENAME]
        self.dir_path = os.path.dirname(self.file_path) \
            if self.is_dir else None
        self.dir_name = self.dir_path.rsplit(os.path.sep, 1)[1] \
            if self.is_dir else None
        self.last_updated = timestamp_to_datetime(dir_entry.stat().st_mtime,
                                                  tzlocal.get_localzone())
        with open(self.file_path) as f:
            data = frontmatter.load(f)
        self.frontmatter = data.metadata
        self.markdown = data.content

    @property
    def title(self):
        return self.frontmatter['title']

    @property
    def category(self):
        category_name = self.frontmatter.get('category')
        if not category_name:
            return None
        return self.category_manager.get_or_create(name=category_name)[0]

    @property
    def tags(self):
        tag_names = self.frontmatter.get('tags')
        if not tag_names:
            return []
        if not isinstance(tag_names, (tuple, list)):
            tag_names = tag_names.split(Config.FRONTMATTER_LIST_DELIMETER)
        return [self.tag_manager.get_or_create(name=tag_name.strip())[0]
                for tag_name in tag_names]
