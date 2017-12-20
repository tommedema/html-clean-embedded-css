const stylesFromHtml = require('styles-from-html')
const cssRazor = require('css-razor').default
const iReplace = require('i-replace')

const headNeedle = '</head'

/**
 * Expects html, removes redundant css within style tags, and returns html. The output HTML
 * document should render the same as the input, but with less css rules present.
 *
 * This is primarily useful if you reduce the number of requests to your web application by
 * embedding your css into a single HTML document instead of a separate stylesheet document,
 * and if you intend to optimize the CSS in that document after embedding it into the HTML document.
 *
 * To simplify implementation, this library does not attempt to preserve whitespace. Instead,
 * a single style tag contained non-redundant CSS rules is prepended exactly before the closing
 * head tag. If no closing head tag is found, the input html document is returned as-is.
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
 * const cleanCssHtml = `<html><head>
 * <style>.one { color: green }</style></head><body><p class="one">nobody uses class two</p></body></html>`
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
  if (html.indexOf(headNeedle) === -1) return html // preserve html if replacement is impossible
  const segmented = stylesFromHtml(html)
  if (!segmented.css) return html // preserve html if no css is present
  try {
    const cleanCss = (await cssRazor({ htmlRaw: segmented.html, cssRaw: segmented.css })).css
    const cleanHtml = iReplace(segmented.html, '</head', `<style>${cleanCss}</style>$1`)
    return cleanHtml
  } catch (err) {
    // cleaning is done on a best-effort basis
    // if there are syntax errors we can silently ignore these
    if (err.name === 'CssSyntaxError') {
      return html
    }
    throw err
  }
}
