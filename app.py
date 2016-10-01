from flask.helpers import get_debug_flag

from backend.app import create_app
from backend.config import (
    DevConfig,
    ProdConfig,
    TEMPLATE_FOLDER,
    STATIC_FOLDER,
    STATIC_URL_PATH,
)

# default to ProdConfig unless FLASK_DEBUG env var is explicitly set to true
app = create_app(
    DevConfig if get_debug_flag(False) else ProdConfig,
    template_folder=TEMPLATE_FOLDER,
    static_folder=STATIC_FOLDER,
    static_url_path=STATIC_URL_PATH
)
