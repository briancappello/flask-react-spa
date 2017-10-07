import frontmatter
import os
import re
import tzlocal

from backend.config import (
    ARTICLE_FILENAME,
    FRONTMATTER_LIST_DELIMETER,
    SERIES_FILENAME,
)
from ...models import Category, Tag
from backend.utils.date import timestamp_to_datetime

DATE_RE = re.compile(r'^(?P<date>\d{4}-\d{2}-\d{2})')
PART_RE = re.compile(r'^(\d{4}-\d{2}-\d{2}-)?(part-)?(?P<part>\d+)', re.IGNORECASE)


class FileData(object):
    def __init__(self, dir_entry: os.DirEntry):
        self.file_path = dir_entry.path
        self.file_name = dir_entry.name
        self.is_dir = self.file_name in [ARTICLE_FILENAME, SERIES_FILENAME]
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
        return Category.get_or_create(name=category_name)

    @property
    def tags(self):
        tag_names = self.frontmatter.get('tags')
        if not tag_names:
            return []
        if not isinstance(tag_names, (tuple, list)):
            tag_names = tag_names.split(FRONTMATTER_LIST_DELIMETER)
        return [Tag.get_or_create(name=tag_name.strip())
                for tag_name in tag_names]
