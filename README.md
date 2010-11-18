Hi. You're the new star!

The Agile 2010 app, courtesy of... **you**!

Building
--------

We have some dependencies.

    $ bundle install

I know. I know.

Deployment
----------

It seems like you might want to know a few things. First:

> http://quad.github.com/agile2010/

That loads the gh-pages branch of this repository, all rendered and beautiful.

You could host locally. Or on a web server. Because this entire project is a
static set of HTML, JS, CSS and friends.

You know how to deploy that, right?

(Hint: if you fork to your own account, you can use
`http://[youTHESTARnamehere].github.com/agile2010/` to much the same result.

Data generation
---------------

	rake schedule
	
	will turn the data stored in the YML files into defaultData.js which is <script> included into the application at runtime.
	
Testing
---------

    rake

That runs Safari. And then does integration tests.
