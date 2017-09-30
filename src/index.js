const pify = require('pify')
const stylesFromHtml = require('styles-from-html')
const cssRazor = pify(require('css-razor').default)
const iReplace = require('i-replace')

/**
 * Expects html, removes redundant css within style tags, and returns html. The output HTML
 * document should render the same as the input, but with less css rules present.
 * This is primarily useful if you reduce the number of requests to your web application by
 * embedding your css into a single HTML document instead of a separate stylesheet document,
 * and if you intend to optimize the CSS in that document after embedding it into the HTML document.
 * @function cleanEmbeddedCss
 * @param {string} html - The HTML document to parse style tags from.
 *
 * @example
 * const assert = require('assert')
 * const cleanEmbeddedCss = require('html-clean-embedded-css')
 *
 * const redundantCssHtml = `<html><head><style>.one { color: green } .two { color: red }</style>
 * </head><body><p class="one">nobody uses class two</p></body></html>`
 *
 * const cleanCssHtml = `<html><head><style>.one { color: green }</style>
 * </head><body><p class="one">nobody uses class two</p></body></html>`
 *
 * ;(async () => {
 *   const html = await cleanEmbeddedCss(redundantCssHtml)
 *   assert.equal(html, cleanCssHtml)
 *   console.log('html with redundant embedded css cleaned to %s', html)
 * })()
 *
 * @returns {string} html - the input HTML document but with embedded style tags having
 * redundant css rules removed.
 */
module.exports = async function cleanEmbeddedCss (html) {
  const segmented = stylesFromHtml(html)
  const cleanCss = (await cssRazor({ htmlRaw: segmented.html, cssRaw: segmented.css })).css
  const cleanHtml = iReplace(segmented.html, '[\\n\\s]*</head', `<style>${cleanCss}</style>$1`)
  return cleanHtml
}
