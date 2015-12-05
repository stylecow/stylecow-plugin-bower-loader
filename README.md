stylecow plugin bower-loader
============================

[![Build Status](https://travis-ci.org/stylecow/stylecow-plugin-bower-loader.svg)](https://travis-ci.org/stylecow/stylecow-plugin-bower-loader)

Stylecow plugin to resolve automatically the css paths of packages installed with [bower](http://bower.io/).

You write:

```css
@import "normalize-css";
```

And stylecow resolves the path and converts to:

```css
@import url("../../../bower_components/normalize-css/normalize.css");
```

You can combine this plugin with [import](https://github.com/stylecow/stylecow-plugin-import) to insert the css code instead resolve only the url.

More demos in [the tests folder](https://github.com/stylecow/stylecow-plugin-bower-loader/tree/master/tests/cases)
