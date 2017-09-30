const assert = require('assert')
const cleanEmbeddedCss = require('../src')

const redundantCssHtml = `<html><head><style>.one { color: green } .two { color: red }</style>
</head><body><p class="one">nobody uses class two</p></body></html>`

const cleanCssHtml = `<html><head>
<style>.one { color: green }</style></head><body><p class="one">nobody uses class two</p></body></html>`

;(async () => {
  const html = await cleanEmbeddedCss(redundantCssHtml)
  assert.equal(html, cleanCssHtml)
  console.log('html with redundant embedded css cleaned to %s', html)
})()
