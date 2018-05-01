import markdown
import os

from bs4 import BeautifulSoup
from flask_unchained import unchained, injectable

from ...config import Config
from ...services import SeriesManager

from .article_data import load_article_datas
from .file_data import FileData


@unchained.inject('series_manager')
class SeriesData(FileData):
    def __init__(self, dir_entry, default_author, last_updated,
                 series_manager: SeriesManager = injectable):
        super().__init__(dir_entry)
        self.articles = load_article_datas(self.dir_path,
                                           default_author,
                                           last_updated,
                                           self)
        self.series_manager = series_manager

    def create_or_update_series(self):
        series, is_create = self.series_manager.get_by(file_path=self.file_path)

        series.title = self.title
        series.file_path = self.file_path
        series.summary = self.summary
        series.category = self.category
        series.tags = self.tags

        return series, is_create

    @property
    def summary(self):
        html = markdown.markdown(self.markdown,
                                 Config.MARKDOWN_EXTENSIONS,
                                 output_format='html5')

        # strip html and body tags
        soup = BeautifulSoup(html, 'lxml')
        return ''.join(map(str, soup.find('body').contents))


def load_series_datas(dir_path, default_author, last_updated):
    for dir_entry in os.scandir(dir_path):  # type: os.DirEntry
        is_dir = dir_entry.is_dir()
        if is_dir and os.path.exists(os.path.join(dir_entry.path,
                                                  Config.SERIES_FILENAME)):
            is_updated = dir_entry.stat().st_mtime > last_updated
            if is_updated:
                yield from load_series_datas(dir_entry.path,
                                             default_author,
                                             last_updated)

        if dir_entry.name == Config.SERIES_FILENAME:
            yield SeriesData(dir_entry, default_author, last_updated)
