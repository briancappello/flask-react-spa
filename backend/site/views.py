from flask import Blueprint, render_template

site = Blueprint('site', __name__)


@site.route('/')
@site.route('/<path:path>')
def index(path=None):
    return render_template('index.html')
