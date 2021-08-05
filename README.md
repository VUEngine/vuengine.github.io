# vuengine.github.io

The VUEngine website.


## Prerequisites

To test this site locally, you’ll need:

    - ruby
    - the github-pages gem


## Installing the github-pages gem

Run the following command to install the github-pages gem and all dependencies, including jekyll.

    gem install github-pages

To update the gem later, run:

    gem update github-pages


## Testing your site locally

To construct and serve and test your site locally, run the following in the root folder of this repository:

    jekyll serve

You can now view the site in your browser at http://127.0.0.1:4000.


## Documentation

The VUEngine Studio documentation is included as a git submodule.

Initiate it with

    git submodule update --init

Later, update it with

    git submodule update --recursive --remote