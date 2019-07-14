#!/bin/bash

# Note from:
# https://setuptools.readthedocs.io/en/latest/setuptools.html
# When building an sdist, the datafiles are also drawn from the
# package_name.egg-info/SOURCES.txt file, so make sure that this
# is removed if the setup.py package_data list is updated before
# calling setup.py.

cd $(dirname $0)/..

rm -rf .eggs
rm -rf *.egg-info
rm -rf **/*.pyc

python setup.py sdist bdist_wheel

rm -rf .eggs
rm -rf *.egg-info
rm -rf **/*.pyc
