# Lazy CF7 Assets

Improves performance by [lazy loading](https://stackoverflow.com/questions/36274/what-is-lazy-loading#36297) _[Contact Form 7](https://wordpress.org/plugins/contact-form-7/)_’s JavaScript files only when one of its forms exists on the page. Use this package on a WordPress website with _Contact Form 7_ plugin active and its JavaScript manually dequeued.

You can override any of the default options, although you'll likely only ever want to do this for `gifPath`.


## Installation

npm:
```bash
npm install lazy-cf7-assets --save
```

Yarn:
```bash
yarn add lazy-cf7-assets
```


## How to dequeue Contact Form 7’s JavaScript inclusion

```php
// In your theme's functions.php file:
add_filter( 'wpcf7_load_js', '__return_false' );

// Optionally dequeue the CSS as well.
// Shown here for your reference only —
// the CSS won't be lazy loaded by this script!
add_filter( 'wpcf7_load_css', '__return_false' );
```


## Usage Examples

After dequeueing _Contact Form 7_’s automatic JavaScript inclusion, you can now set its JavaScript files to load dynamically by importing _Lazy CF7 Assets_ and initialising it from within your site’s JavaScript bundle, like so:

```javascript
import lazyform from 'lazy-cf7-assets';

// Initialise once the DOM is ready, ie. at the end of the `body` tag.
lazyform.init()
```

Alternatively, if your scripts are included in the `head` tag rather than the end of the `body` tag, you should make sure the initialisation occurs after all the page elements have been rendered, thusly:

```javascript
import lazyform from 'lazy-cf7-assets';

// ensures all page elements are loaded
// so the presence of CF7 forms can be detected
document.addEventListener('DOMContentLoaded', function() {
  lazyform.init()
})
```

You can override one or more of the default options by passing them into `init` via an object. You'll likely only ever need to do this for `gifPath` in the case where you’d prefer to use a custom loading animation gif rather than the default one included with _Contact Form 7_.

```javascript
import lazyform from 'lazy-cf7-assets';

lazyform.init({
  // Set an absolute path to the alternate loading gif
  gifPath: '/wp-content/themes/my-theme-name/images/ajax-loader.gif'
});
```

Here is the full set of options:

```javascript
{
  foundForm: document.querySelector('.wpcf7-form'),
  gifPath: '/wp-content/plugins/contact-form-7/images/ajax-loader.gif',
  jqueryPath: '/wp-includes/js/jquery/jquery.js',
  jqueryFormPath: '/wp-content/plugins/contact-form-7/includes/js/jquery.form.min.js',
  cf7ScriptPath: '/wp-content/plugins/contact-form-7/includes/js/scripts.js'
}
```


## License

MIT
