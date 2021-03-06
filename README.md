# html-clean-embedded-css

Expects html, removes redundant css within style tags, and returns html.

This module currently exports an async function because one of its dependencies is expecting an asynchronous operation (reading from file system). This module does not actually use the file system, so this should not be necessary. This could be resolved in the future by patching `css-razor` to not be async if the file system is not accessed.

This library is largely based on [css-razor](https://github.com/tscanlin/css-razor). For alternative libraries that remove redundant CSS rules, also consider:
- https://github.com/FullHuman/purgecss
- https://github.com/purifycss/purifycss
- https://github.com/giakki/uncss
- https://github.com/patrickhulce/nukecss
- https://github.com/jakubpawlowicz/clean-css

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Install

```bash
npm install --save html-clean-embedded-css
# or yarn add html-clean-embedded-css
```

## Running tests

```bash
npm test
```

## Rebuilding API documentation

```bash
npm run docs
```

This will append to `README.md` by default.

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### API documentation

-   [cleanEmbeddedCss](#cleanembeddedcss)

## cleanEmbeddedCss

Expects html, removes redundant css within style tags, and returns html. The output HTML
document should render the same as the input, but with less css rules present.

This is primarily useful if you reduce the number of requests to your web application by
embedding your css into a single HTML document instead of a separate stylesheet document,
and if you intend to optimize the CSS in that document after embedding it into the HTML document.

To simplify implementation, this library does not attempt to preserve whitespace. Instead,
a single style tag contained non-redundant CSS rules is prepended exactly before the closing
head tag. If no closing head tag is found, the input html document is returned as-is.

**Parameters**

-   `html` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The HTML document to parse style tags from.

**Examples**

```javascript
const assert = require('assert')
const cleanEmbeddedCss = require('html-clean-embedded-css')

const redundantCssHtml = `<html><head><style>.one { color: green } .two { color: red }</style>
</head><body><p class="one">nobody uses class two</p></body></html>`

const cleanCssHtml = `<html><head>
<style>.one { color: green }</style></head><body><p class="one">nobody uses class two</p></body></html>`

;(async () => {
  const html = await cleanEmbeddedCss(redundantCssHtml)
  assert.equal(html, cleanCssHtml)
  console.log('html with redundant embedded css cleaned to %s', html)
})()
```

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** html - the input HTML document but with embedded style tags having
redundant css rules removed.
