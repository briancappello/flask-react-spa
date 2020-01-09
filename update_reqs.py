#!/usr/bin/env python3

import click
import os
import subprocess
import sys


def main():
    result = subprocess.run(['pip', 'show', 'pip-tools'], stdout=subprocess.PIPE)
    if not result.stdout.strip():
        click.secho('This script requires the pip-tools package be installed:\n'
                    '    pip install pip-tools', fg='white', bg='red')
        sys.exit(1)

    req_args = ['pip-compile', '--output-file', 'requirements.txt',
                'requirements.in', '--upgrade']
    print('Running ' + ' '.join(req_args))
    subprocess.run(req_args, stdout=subprocess.PIPE)

    dev_req_args = ['pip-compile', '--output-file', 'requirements-dev.txt',
                    'requirements-dev.in', '--upgrade']
    print('Running ' + ' '.join(dev_req_args))
    subprocess.run(dev_req_args, stdout=subprocess.PIPE)

    with open(os.path.join(os.getcwd(), 'requirements.txt')) as f:
        requirements = f.read()

    dev_requirements_path = os.path.join(os.getcwd(), 'requirements-dev.txt')
    with open(dev_requirements_path) as f:
        dev_requirements = f.read()

    reqs = set([line[:line.find('==')]
                for line in requirements.splitlines()
                if line and not line.startswith('#')])

    dev_reqs = [line for line in dev_requirements.splitlines()
                if line and not line.startswith('#')
                and line[:line.find('==')] not in reqs]

    new_dev_reqs = [line for line in dev_requirements.splitlines()
                    if line.startswith('#')] + ['-r requirements.txt', ''] + dev_reqs

    with open(dev_requirements_path, 'w') as f:
        f.write('\n'.join(new_dev_reqs) + '\n')

    print('Successfully updated requirements.txt and requirements-dev.txt')


if __name__ == '__main__':
    main()
