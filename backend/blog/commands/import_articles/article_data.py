import functools
import markdown
import os
import pytz
import re

from bs4 import BeautifulSoup, Tag as SoupTag

from backend.config import (
    ARTICLE_FILENAME,
    ARTICLE_PREVIEW_LENGTH,
    ARTICLE_STYLESHEET_FILENAME,
    ARTICLES_FOLDER,
    MARKDOWN_EXTENSIONS,
    SERIES_FILENAME,
    STATIC_URL_PATH,
)
from backend.security.models import User
from ...models import Article, Tag
from backend.utils.date import parse_datetime, utcnow

from .file_data import FileData

DATE_RE = re.compile(r'^(?P<date>\d{4}-\d{2}-\d{2})')
PART_RE = re.compile(r'^(\d{4}-\d{2}-\d{2}-)?(part-)?(?P<part>\d+)', re.IGNORECASE)


class ArticleData(FileData):
    def __init__(self, dir_entry, default_author, series_data=None):
        super().__init__(dir_entry)
        self.default_author = default_author
        self.series_data = series_data

    def create_or_update_article(self):
        is_create = False
        article = Article.get_by(file_path=self.file_path)
        if not article:
            article = Article.create(author=self.author)
            is_create = True

        article.title = self.title
        article.publish_date = self.publish_date
        if not is_create:
            article.last_updated = self.last_updated
        article.file_path = self.file_path
        article.header_image = self.header_image
        article.html = self.html
        article.preview = self.preview
        article.category = self.category
        article.tags = self.tags

        return article, is_create

    @property
    def author(self):
        author = self.frontmatter.get('by', self.frontmatter.get('author'))
        if author and '@' in author:
            return User.get_by(email=author)
        elif author:
            return User.get_by(username=author)
        return self.default_author

    @property
    def part(self):
        match = re.match(PART_RE,
                         self.is_dir and self.dir_name or self.file_name)
        return match and int(match.group('part')) or None

    @property
    def publish_date(self):
        datestamp = self.frontmatter.get('publish_date')
        if not datestamp:
            match = re.match(DATE_RE,
                             self.is_dir and self.dir_name or self.file_name)
            datestamp = match and match.group('date') or None
        if datestamp:
            datestamp = parse_datetime(datestamp)
        return datestamp and datestamp.astimezone(pytz.UTC) or utcnow()

    @property
    def header_image(self):
        header_image = self.frontmatter.get('header_image')
        if not header_image:
            return None
        return self._get_static_url(header_image)

    @property
    @functools.lru_cache()
    def html(self):
        html = markdown.markdown(self.markdown,
                                 extensions=MARKDOWN_EXTENSIONS,
                                 output_format='html5')

        # fix image links
        soup = BeautifulSoup(html, 'lxml')
        for img in soup.find_all('img'):
            img.attrs['src'] = self._get_static_url(img.attrs['src'])

        # strip html and body tags
        body = soup.find('body') or ''
        if isinstance(body, SoupTag):
            body = ''.join(map(str, body.contents))

        # prefix stylesheet if necessary
        if not self.is_dir or not os.path.exists(
                os.path.join(self.dir_path, ARTICLE_STYLESHEET_FILENAME)):
            return body

        href = self._get_static_url(ARTICLE_STYLESHEET_FILENAME)
        return f'<link rel="stylesheet" type="text/css" href="{href}">' + body

    @property
    def preview(self):
        soup = BeautifulSoup(self.html, 'lxml')
        p = soup.find('p')
        if not p:
            return ''

        preview = ''
        preview_len = 0
        for el in p.contents:
            is_tag = isinstance(el, Tag)
            el_text = el.text if is_tag else str(el)
            preview_len += len(el_text)
            if preview_len > ARTICLE_PREVIEW_LENGTH:
                if not is_tag:
                    max_el_text_len = len(el_text) - (preview_len - ARTICLE_PREVIEW_LENGTH)
                    preview += el_text[:el_text.rfind(' ', 0, max_el_text_len)]
                break
            preview += str(el)
        return preview.strip()

    def _get_static_url(self, resource):
        path_parts = [STATIC_URL_PATH,
                      os.path.basename(ARTICLES_FOLDER),
                      self.series_data.dir_name if self.series_data else None,
                      self.dir_name,
                      resource]
        return '/'.join(x for x in path_parts if x)


def load_article_datas(dir_path, default_author, last_updated, series_data=None):
    for dir_entry in os.scandir(dir_path):  # type: os.DirEntry
        is_dir = dir_entry.is_dir()
        if is_dir and os.path.exists(os.path.join(dir_entry.path,
                                                  ARTICLE_FILENAME)):
            yield from load_article_datas(dir_entry.path, default_author, last_updated, series_data)
            continue

        is_markdown = dir_entry.is_file() and dir_entry.name.endswith('.md')
        is_updated = dir_entry.stat().st_mtime > last_updated
        if is_updated and is_markdown and dir_entry.name != SERIES_FILENAME:
            yield ArticleData(dir_entry, default_author, series_data)
