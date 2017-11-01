#!/usr/bin/env python
import os

from glob import glob
from livereload import Server, shell


server = Server()

server.watch('*.py', shell('make html', cwd='.'), delay=0)
for path in glob('backend/**/*.py', recursive=True):
    server.watch(path, shell('make html', cwd='.'), delay=0)

server.watch('docs/*.rst', shell('make html', cwd='.'), delay=0)
server.watch('docs/_static/*.css', shell('make doc_styles', cwd='.'), delay=0)
server.watch('docs/_templates/*.html', shell('make html', cwd='.'), delay=0)

server.serve(root='docs/_build/html',
             port=os.getenv('SPHINX_DOCS_PORT', 5500),
             host=os.getenv('SPHINX_DOCS_HOST', '127.0.0.1'),
             restart_delay=0)
