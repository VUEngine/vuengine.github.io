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

To construct and test your site locally, run the following in the root folder of this repository:

    jekyll build

This will create (or modify) a _site/ directory, containing everything from assets/, and then the index.md and all pages/*.md files, converted to html. So there’ll be _site/index.html and the various _site/pages/*.html.

To serve the site, run the following:

    jekyll serve

You can now view the site in your browser at http://127.0.0.1:4000.

Note: this will first run "jekyll build" implicitly, so a manual build step is not needed before.