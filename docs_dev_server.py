#!/usr/bin/env python

from livereload import Server, shell


server = Server()

server.watch('*.py', shell('make html', cwd='docs'))
server.watch('**/*.py', shell('make html', cwd='docs'))

server.watch('*.rst', shell('make html', cwd='docs'))
server.watch('**/*.rst', shell('make html', cwd='docs'))

server.watch('docs/_static/*.css', shell('make doc_styles', cwd='.'))
server.watch('docs/_templates/*.html', shell('make html', cwd='docs'))

server.serve(root='docs/_build/html')
