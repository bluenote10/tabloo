#!/bin/bash
twine upload --repository-url https://test.pypi.org/legacy/ "$@"

# https://test.pypi.org/project/tabloo/#history
# pip install -i https://test.pypi.org/simple/ tabloo
