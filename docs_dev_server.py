#!/usr/bin/env python
import os

from livereload import Server, shell


server = Server()

server.watch('*.py', shell('make html', cwd='docs'))
server.watch('**/*.py', shell('make html', cwd='docs'))

server.watch('*.rst', shell('make html', cwd='docs'))
server.watch('**/*.rst', shell('make html', cwd='docs'))

server.watch('docs/_static/*.css', shell('make doc_styles', cwd='.'))
server.watch('docs/_templates/*.html', shell('make html', cwd='docs'))

server.serve(root='docs/_build/html',
             port=os.getenv('SPHINX_DOCS_PORT', 5500),
             host=os.getenv('SPHINX_DOCS_HOST', '127.0.0.1'),
             restart_delay=0)
