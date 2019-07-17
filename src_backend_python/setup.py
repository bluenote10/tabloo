from setuptools import setup, find_packages

with open("requirements.txt") as f:
    requirements = f.read().splitlines()

with open("README.md", "r") as f:
    long_description = f.read()

setup(
    name="tabloo",
    version="0.0.5",

    license="MIT",
    author="Fabian Keller",
    author_email='pypi.20.fkeller@spamgourmet.com',
    url="https://github.com/bluenote10/tabloo",

    description="Minimalistic dashboard app for visualizing tabular data",
    long_description=long_description,
    long_description_content_type="text/markdown",
    keywords=["table", "dataframe", "visualization", "plots", "dashboard"],
    # https://pypi.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Information Technology',
        'Topic :: Scientific/Engineering :: Visualization',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Operating System :: OS Independent',
    ],

    install_requires=requirements,
    setup_requires=["pytest-runner"],
    tests_require=[
        "pytest",
        "pytest-cov",
    ],
    packages=find_packages(),

    # Since `static` isn't a Python package, we need to specify its name.
    # https://setuptools.readthedocs.io/en/latest/setuptools.html#including-data-files
    package_data={"": [
        "static/*",
        "static/**/*",
    ]},
    exclude_package_data={"": [
        #"static/*.js.map"
    ]},
    # We need to disable `include_package_data` because we don't
    # have a MANIFEST.in and don't want to depend on source control
    # to affect package_data inclusion:
    # https://stackoverflow.com/a/13783919/1804173
    include_package_data=False,
)
