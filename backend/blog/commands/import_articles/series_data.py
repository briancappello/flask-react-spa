import markdown
import os

from bs4 import BeautifulSoup

from backend.config import MARKDOWN_EXTENSIONS, SERIES_FILENAME
from ...models import Series

from .article_data import load_article_datas
from .file_data import FileData


class SeriesData(FileData):
    def __init__(self, dir_entry, default_author, last_updated):
        super().__init__(dir_entry)
        self.articles = load_article_datas(self.dir_path,
                                           default_author,
                                           last_updated,
                                           self)

    def create_or_update_series(self):
        is_create = False
        series = Series.get_by(file_path=self.file_path)
        if not series:
            series = Series.create()
            is_create = True

        series.title = self.title
        series.file_path = self.file_path
        series.summary = self.summary
        series.category = self.category
        series.tags = self.tags

        return series, is_create

    @property
    def summary(self):
        html = markdown.markdown(self.markdown,
                                 extensions=MARKDOWN_EXTENSIONS,
                                 output_format='html5')

        # strip html and body tags
        soup = BeautifulSoup(html, 'lxml')
        return ''.join(map(str, soup.find('body').contents))


def load_series_datas(dir_path, default_author, last_updated):
    for dir_entry in os.scandir(dir_path):  # type: os.DirEntry
        is_dir = dir_entry.is_dir()
        if is_dir and os.path.exists(os.path.join(dir_entry.path,
                                                  SERIES_FILENAME)):
            is_updated = dir_entry.stat().st_mtime > last_updated
            if is_updated:
                yield from load_series_datas(dir_entry.path,
                                             default_author,
                                             last_updated)

        if dir_entry.name == SERIES_FILENAME:
            yield SeriesData(dir_entry, default_author, last_updated)
