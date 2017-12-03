from flask import render_template

from .blueprint import site


# this view (shouldn't) ever be used, but we include it for the possibility to
# link to the homepage from email templates, or for gracefully showing when
# something's wrong in development
# (in development, webpack should be serving a dynamically generated index.html)
# (in production, NGINX should be serving the statically generated index.html)
@site.route('/')
@site.route('/<path:path>')
def index(path=None):
    return render_template('index.html')
