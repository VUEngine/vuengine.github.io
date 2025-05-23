# vuengine.github.io

The VUEngine website at https://www.vuengine.dev/.

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

To construct, serve and test your site locally, run the following in the root folder of this repository:

    jekyll serve

You can now view the site in your browser at http://127.0.0.1:4000.

## Update API docs

To update VUEngine Core API docs run:

    npm run updateDoxygen

This will pull the latest sources, run doxygen on them and post-process the HTML output.

Note: Initially, you'll have to init the VUEngine Core submodule once, after checking out this repository.

    git submodule update --init
