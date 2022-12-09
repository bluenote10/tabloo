from setuptools import find_packages, setup

with open("requirements.txt") as f:
    requirements = f.read().splitlines()

with open("README.md", "r") as f:
    long_description = f.read()

setup(
    name="tabloo",
    version="0.1.0",
    license="MIT",
    author="Fabian Keller",
    author_email="pypi.20.fkeller@spamgourmet.com",
    url="https://github.com/bluenote10/tabloo",
    description="Minimalistic dashboard app for visualizing tabular data",
    long_description=long_description,
    long_description_content_type="text/markdown",
    keywords=["table", "dataframe", "visualization", "plots", "dashboard"],
    # https://pypi.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Information Technology",
        "Topic :: Scientific/Engineering :: Visualization",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Operating System :: OS Independent",
    ],
    install_requires=requirements,
    setup_requires=["pytest-runner"],
    tests_require=[
        "pytest",
        "pytest-cov",
    ],
    packages=find_packages(),
    # To make use of MANIFEST.in:
    include_package_data=True,
    # Note: This is simpler then using package_data, because I couldn't figure out
    # how to package top level files like requirements.txt, and it seems to work for
    # both sdist and bdist packaging.
    # https://setuptools.readthedocs.io/en/latest/setuptools.html#including-data-files
    # https://stackoverflow.com/a/13783919/1804173
)
