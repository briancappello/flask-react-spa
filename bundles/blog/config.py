import os

from backend.config import Config as AppConfig


class Config(AppConfig):
    ARTICLES_FOLDER = os.path.join(AppConfig.PROJECT_ROOT, 'articles')
    ARTICLE_PREVIEW_LENGTH = 400
    FRONTMATTER_LIST_DELIMETER = ','
    MARKDOWN_EXTENSIONS = ['extra']
    DEFAULT_ARTICLE_AUTHOR_EMAIL = 'a@a.com'
    SERIES_FILENAME = 'series.md'
    ARTICLE_FILENAME = 'article.md'
    ARTICLE_STYLESHEET_FILENAME = 'styles.css'
