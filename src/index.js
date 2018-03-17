import $script from 'scriptjs'

export default {

  init (assets = {}) {
    window._wpcf7 = null
    const defaultAssets = {
      foundForms: document.querySelector('.wpcf7-form'),
      gifPath: '/wp-content/plugins/contact-form-7/images/ajax-loader.gif',
      jqueryPath: '/wp-includes/js/jquery/jquery.js',
      jqueryFormPath: '/wp-content/plugins/contact-form-7/includes/js/jquery.form.min.js',
      cf7ScriptPath: '/wp-content/plugins/contact-form-7/includes/js/scripts.js'
    }
    this.assets = (typeof Object.assign !== 'undefined')
      ? Object.assign({}, defaultAssets, assets)
      : defaultAssets
    if (!this.allAssetsFound() || this.badBrowser()) { return false }
    this.applyLoaderGifs()
    this.boundSubmitHandler = this.submitHandler.bind(this)
    this.boundLoadFormScripts = this.loadFormScripts.bind(this)
    this.attachSubmitHandlers()
  },

  applyLoaderGifs () {
    this.loaderGif = this.createLoader()
    const targets = [].slice.call(document.querySelectorAll('.wpcf7-submit'))
    targets.forEach((el) => {
      el.insertAdjacentElement('afterend', this.loaderGif.cloneNode(true))
    })
  },

  badBrowser () {
    return !('querySelector' in document && document.addEventListener)
  },

  allAssetsFound () {
    return Object.values().every(asset => assets !== null)
  },

  attachSubmitHandlers () {
    const targets = [].slice.call(document.querySelectorAll('.wpcf7-form'))
    targets.forEach((form) => {
      form.addEventListener('submit', this.boundSubmitHandler)
    })
  },

  loadFormScripts () {
    $script(this.assets.jqueryFormPath, 'jqFormPlugin')
    $script.ready('jqFormPlugin', () => {
      $script(this.assets.cf7ScriptPath, 'formBundle')
    })
  },

  scriptsReadyHandler (e) {
    e.target.removeEventListener(e.type, this.boundSubmitHandler, false)
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('submit', false, true)
    e.target.dispatchEvent(evt)
  },

  // runs once per CF7 form
  submitHandler (e) {
    e.preventDefault()

    if (typeof window.jQuery === 'undefined') {
      $script(this.assets.jqueryPath, 'jquery')
      $script.ready('jquery', this.boundLoadFormScripts)
    } else {
      this.boundLoadFormScripts()
    }

    $script.ready('formBundle', this.scriptsReadyHandler.bind(this, e))
  },

  createLoader () {
    const img = document.createElement('img')
    img.setAttribute('class', 'ajax-loader')
    img.alt = 'Sending...'
    img.style.visibility = 'hidden'
    img.src = this.assets.gifPath
    return img
  }
}
