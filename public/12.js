webpackJsonp([12],{

/***/ 648:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(825)
/* template */
var __vue_template__ = __webpack_require__(831)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\pages\\Users.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2de69fbe", Component.options)
  } else {
    hotAPI.reload("data-v-2de69fbe", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 659:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(667)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 660:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Export the Any Component
 */
/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            darkClass: App.theme.dark,
            primaryClass: App.theme.primary,
            accentClass: App.theme.accent,
            secondaryClass: App.theme.secondary,
            infoClass: App.theme.info,
            warningClass: App.theme.warning,
            errorClass: App.theme.error,
            successClass: App.theme.success,
            toggleBarStyle: App.site.toggleBarStyle,
            titleStyle: App.site.titleStyle,
            navbarStyle: App.site.navbarStyle,
            footerStyle: App.site.footerStyle,
            sidebarStyle: App.site.sidebarStyle,
            domain: App.site.domain,
            year: new Date().getFullYear(),
            trademark: App.site.trademark,
            logo: App.site.logo.url,
            logoStyle: {
                width: App.site.logo.width,
                height: App.site.logo.height
            },
            showLogo: App.site.logo.show,
            showIcon: App.site.icon.show,
            icon: App.site.icon.name ? App.site.icon.name : null,
            iconColor: App.site.icon.color,
            title: App.site.trademark
        };
    },
    computed: {
        isDark: function isDark() {
            return this.darkClass === true;
        }
    }

});

/***/ }),

/***/ 661:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(672)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(674)
/* template */
var __vue_template__ = __webpack_require__(675)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0af594a9"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\VLink.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0af594a9", Component.options)
  } else {
    hotAPI.reload("data-v-0af594a9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(663);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(664), __esModule: true };

/***/ }),

/***/ 664:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(665);
module.exports = __webpack_require__(31).Object.assign;


/***/ }),

/***/ 665:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(61);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(666) });


/***/ }),

/***/ 666:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(89);
var gOPS = __webpack_require__(130);
var pIE = __webpack_require__(90);
var toObject = __webpack_require__(318);
var IObject = __webpack_require__(319);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(67)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ 667:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 668:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(669)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(671)
/* template */
var __vue_template__ = __webpack_require__(676)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\partials\\AppFooter.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d518971e", Component.options)
  } else {
    hotAPI.reload("data-v-d518971e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 669:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(670);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("b358074c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d518971e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppFooter.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d518971e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppFooter.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 670:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 671:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_theme__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__);
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        VLink: __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default.a
    },
    mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_theme__["a" /* default */]],
    data: function data() {
        return {
            footerClass: { 'primary--text': true, 'grey': true, 'darken-4': true }
        };
    },
    created: function created() {
        var _this = this;

        /* Emit On a Child Component If You Want This To Be Visible */
        Bus.$on('footer-content-visible', function (visibility) {
            _this.contentVisible = visibility;
        });
    }
});

/***/ }),

/***/ 672:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(673);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("75fe3b23", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0af594a9\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VLink.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0af594a9\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VLink.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 673:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n.styleAvatar[data-v-0af594a9] {\n  position: relative;\n  margin-left: -55px;\n}\n", ""]);

// exports


/***/ }),

/***/ 674:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        dark: {
            type: Boolean,
            default: function _default() {
                return App.theme.dark;
            }
        },
        href: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: function _default() {
                return '';
            }
        },
        icon: {
            type: String,
            default: function _default() {
                return '';
            }
        },
        iconColor: {
            type: String,
            default: function _default() {
                return this.dark ? '#fafafa' : '#78909C'; // white or blue-grey lighten-1
            }
        },
        linkColor: {
            type: String,
            default: function _default() {
                return this.dark ? '#fafafa' : '#e3b500'; // white or blue-grey lighten-1
            }
        },
        activeColor: {
            type: String,
            default: function _default() {
                return '#f5c300'; // teal lighten 2
            }
        }
    },
    computed: {
        isActive: function isActive() {
            return this.href === this.$route.path;
        },
        isDark: function isDark() {
            return this.dark === true;
        },
        avatarOn: function avatarOn() {
            return !!this.avatar;
        },
        iconOn: function iconOn() {
            return !!this.icon;
        }
    },
    methods: {
        navigate: function navigate(href) {
            var self = this;
            /* if valid url */
            if (self.isURL(href)) {
                window.open(href);
            } else {
                /* when using vue router path */
                this.$router.push({ path: '' + href });
            }
        },
        isURL: function isURL(str) {
            var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
            var url = new RegExp(urlRegex, 'i');
            return str.length < 2083 && url.test(str);
        }
    }
});

/***/ }),

/***/ 675:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-list-tile",
    {
      class: [{ styleAvatar: _vm.avatarOn }],
      attrs: { avatar: _vm.avatarOn },
      nativeOn: {
        click: function($event) {
          _vm.navigate(_vm.href)
        }
      }
    },
    [
      _vm.iconOn && !_vm.avatarOn
        ? _c(
            "v-list-tile-action",
            [
              _c(
                "v-icon",
                {
                  style: {
                    color: _vm.isActive ? _vm.activeColor : _vm.iconColor,
                    cursor: _vm.href ? "pointer" : ""
                  }
                },
                [_vm._v(_vm._s(_vm.icon))]
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.iconOn && _vm.avatarOn
        ? _c("v-list-tile-avatar", [
            _c("img", { attrs: { src: _vm.avatar, alt: "" } })
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-list-tile-content",
        [
          _c(
            "v-list-tile-title",
            {
              style: { color: _vm.isActive ? _vm.activeColor : _vm.linkColor }
            },
            [
              _c("span", { style: { cursor: _vm.href ? "pointer" : "" } }, [
                _vm._v(_vm._s(_vm.title))
              ])
            ]
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.iconOn && _vm.avatarOn
        ? _c(
            "v-list-tile-action",
            [
              _c(
                "v-icon",
                {
                  style: {
                    color: _vm.isActive ? _vm.activeColor : _vm.iconColor,
                    cursor: _vm.href ? "pointer" : ""
                  }
                },
                [_vm._v(_vm._s(_vm.icon))]
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0af594a9", module.exports)
  }
}

/***/ }),

/***/ 676:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-footer",
    { class: [_vm.footerClass], attrs: { app: "" } },
    [
      _c("v-spacer"),
      _c("span", [
        _vm._v(
          "© " +
            _vm._s(_vm.year) +
            " " +
            _vm._s(_vm.domain) +
            " ® | " +
            _vm._s(_vm.trademark) +
            "™"
        )
      ]),
      _c("v-spacer")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d518971e", module.exports)
  }
}

/***/ }),

/***/ 677:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(678)
/* template */
var __vue_template__ = __webpack_require__(687)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\layouts\\Main.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b9f9d6a", Component.options)
  } else {
    hotAPI.reload("data-v-2b9f9d6a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 678:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue__ = __webpack_require__(668);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue__ = __webpack_require__(679);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue__ = __webpack_require__(684);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        AppFooter: __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue___default.a,
        AppNavBar: __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue___default.a,
        LeftSideBar: __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue___default.a
    }
});

/***/ }),

/***/ 679:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(680)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(682)
/* template */
var __vue_template__ = __webpack_require__(683)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\partials\\AppNavBar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d1431f74", Component.options)
  } else {
    hotAPI.reload("data-v-d1431f74", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 680:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(681);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("3a868879", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1431f74\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppNavBar.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1431f74\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppNavBar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 681:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 682:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_theme__ = __webpack_require__(660);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_theme__["a" /* default */]],
    data: function data() {
        return {
            extension: false
        };
    },
    created: function created() {
        var _this = this;

        /* Emit On a Child Component If You Want This To Be Visible */
        Bus.$on('header-extension-visible', function (visibility) {
            _this.extension = visibility;
        });
    },

    methods: {
        toggleDrawer: function toggleDrawer() {
            Bus.$emit('toggleDrawer');
        }
    }
});

/***/ }),

/***/ 683:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-toolbar",
    { attrs: { color: "accent", fixed: "", app: "" } },
    [
      _c("v-toolbar-side-icon", {
        style: _vm.toggleBarStyle,
        nativeOn: {
          click: function($event) {
            $event.stopPropagation()
            _vm.toggleDrawer()
          }
        }
      }),
      _vm._v(" "),
      _vm.extension
        ? _c(
            "v-toolbar-title",
            {
              staticClass: "text-xs-center ml-0 pl-3",
              class: _vm.$vuetify.breakpoint.width <= 1264 && "pr-3",
              style: _vm.$vuetify.breakpoint.width > 1264 && "width: 300px",
              attrs: { slot: "extension" },
              slot: "extension"
            },
            [
              _vm.showIcon
                ? _c(
                    "v-icon",
                    {
                      staticClass: "ml-3 hidden-md-and-down",
                      style: { color: _vm.iconColor }
                    },
                    [_vm._v("\n      " + _vm._s(_vm.icon) + "\n    ")]
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "span",
                { staticClass: "hidden-md-and-down", style: _vm.titleStyle },
                [_vm._v("\n      " + _vm._s(_vm.title) + "\n    ")]
              )
            ],
            1
          )
        : _c(
            "v-toolbar-title",
            { staticClass: "text-xs-center" },
            [
              _vm.showIcon
                ? _c(
                    "v-icon",
                    {
                      staticClass: "ml-3 hidden-md-and-down",
                      style: { color: _vm.iconColor }
                    },
                    [_vm._v("\n      " + _vm._s(_vm.icon) + "\n    ")]
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "span",
                { staticClass: "hidden-md-and-down", style: _vm.titleStyle },
                [_vm._v("\n      " + _vm._s(_vm.title) + "\n    ")]
              )
            ],
            1
          ),
      _vm._v(" "),
      _c("v-spacer"),
      _vm._v(" "),
      _vm.showLogo
        ? _c("img", {
            staticClass: "hidden-md-and-up",
            style: [_vm.logoStyle],
            attrs: { src: _vm.logo, alt: "App.site.title" }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("v-spacer")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d1431f74", module.exports)
  }
}

/***/ }),

/***/ 684:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(685)
/* template */
var __vue_template__ = __webpack_require__(686)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\partials\\LeftSideBar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-648c4aca", Component.options)
  } else {
    hotAPI.reload("data-v-648c4aca", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 685:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__ = __webpack_require__(662);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_theme__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(88);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["createNamespacedHelpers"])('auth'),
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        VLink: __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default.a
    },
    mixins: [__WEBPACK_IMPORTED_MODULE_2__mixins_theme__["a" /* default */]],
    data: function data() {
        return {
            drawer: false
        };
    },
    computed: __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default()({}, mapState({
        isAuthenticated: 'isAuthenticated'
    })),
    created: function created() {
        var self = this;
        switch (self.$vuetify.breakpoint.name) {
            case 'xs':
                return self.drawer = false;
            case 'sm':
                return self.drawer = false;
            case 'md':
                return self.drawer = true;
            case 'lg':
                return self.drawer = true;
            case 'xl':
                return self.drawer = true;
        }
    },
    mounted: function mounted() {
        var self = this;
        Bus.$on('toggleDrawer', function () {
            self.drawer = !self.drawer;
        });
    }
});

/***/ }),

/***/ 686:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-navigation-drawer",
    {
      staticClass: "accent",
      attrs: {
        fixed: "",
        clipped: _vm.$vuetify.breakpoint.width <= 1264 && true,
        "hide-overlay": "",
        app: ""
      },
      model: {
        value: _vm.drawer,
        callback: function($$v) {
          _vm.drawer = $$v
        },
        expression: "drawer"
      }
    },
    [
      _c(
        "v-list",
        { attrs: { dense: "" } },
        [
          _c("v-link", {
            attrs: {
              dark: _vm.darkClass,
              title: "Home",
              href: "/",
              icon: "fa-home"
            }
          }),
          _vm._v(" "),
          _c("v-link", {
            attrs: {
              dark: _vm.darkClass,
              title: "Support",
              href: "/support",
              icon: "message"
            }
          }),
          _vm._v(" "),
          _c(
            "v-subheader",
            {
              class: {
                "blue-grey--text": !_vm.isDark,
                "text--lighten-1": !_vm.isDark,
                "white--text": _vm.isDark
              }
            },
            [_vm._v("Members Area")]
          ),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "User Management",
                  href: "/users",
                  icon: "supervisor_account"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Dashboard",
                  href: "/dashboard",
                  icon: "fa-tachometer"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Reports",
                  href: "/reports",
                  icon: "fa-wpforms "
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Accounts",
                  href: "/accounts",
                  icon: "fa-users"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Create Post",
                  href: "/posts",
                  icon: "event_note"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Failed Post",
                  href: "/failure",
                  icon: "event_busy"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Published Post",
                  href: "/published",
                  icon: "event_available"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Scheduled Post",
                  href: "/scheduled",
                  icon: "update"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Boost Organic Traffic",
                  href: "/traffic",
                  icon: "trending_up"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Settings",
                  href: "/settings",
                  icon: "fa-cogs"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Logout",
                  href: "/logout",
                  icon: "power_settings_new"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          !_vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Login",
                  href: "/login",
                  icon: "fa-key"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          !_vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Register",
                  href: "/register",
                  icon: "fa-user-plus"
                }
              })
            : _vm._e()
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-648c4aca", module.exports)
  }
}

/***/ }),

/***/ 687:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-app",
    { attrs: { id: "inspire" } },
    [
      _c("left-side-bar"),
      _vm._v(" "),
      _c("app-nav-bar"),
      _vm._v(" "),
      _c(
        "v-content",
        {
          attrs: {
            transition: "slide-x-transition",
            fluid: "",
            "pa-0": "",
            "ma-0": ""
          }
        },
        [_vm._t("default")],
        2
      ),
      _vm._v(" "),
      _c("app-footer")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2b9f9d6a", module.exports)
  }
}

/***/ }),

/***/ 688:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {
        isLoggedIn: function isLoggedIn() {
            return !!this.$store.state.auth.isAuthenticated;
        },
        hasRole: function hasRole(payload) {
            var me = this.$store.getters['auth/getMe'];
            return _.includes(me.roles, payload);
        },
        hasPermission: function hasPermission(payload) {
            var me = this.$store.getters['auth/getMe'];
            return _.includes(me.permissions, payload);
        },
        hasAnyPermission: function hasAnyPermission(permissions) {
            var me = this.$store.getters['auth/getMe'];
            return permissions.some(function (p) {
                return me.permissions.includes(p);
            });
        },
        hasAnyRole: function hasAnyRole(roles) {
            var me = this.$store.getters['auth/getMe'];
            return roles.some(function (r) {
                return me.roles.includes(r);
            });
        },
        hasAllRoles: function hasAllRoles(roles) {
            var me = this.$store.getters['auth/getMe'];
            return _.difference(roles, me.roles).length === 0;
        },
        hasAllPermissions: function hasAllPermissions(permissions) {
            var me = this.$store.getters['auth/getMe'];
            return _.difference(permissions, me.permissions).length === 0;
        },
        can: function can(permission) {
            return this.$store.getters['auth/getMe'].can[permission];
        }
    }
});

/***/ }),

/***/ 825:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_toConsumableArray__ = __webpack_require__(826);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__layouts_Main_vue__ = __webpack_require__(677);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__layouts_Main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__layouts_Main_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mixins_theme__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mixins_acl__ = __webpack_require__(688);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        MainLayout: __WEBPACK_IMPORTED_MODULE_3__layouts_Main_vue___default.a
    },
    mixins: [__WEBPACK_IMPORTED_MODULE_4__mixins_theme__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__mixins_acl__["a" /* default */]],
    data: function data() {
        return {
            contentClass: { 'grey': true, 'lighten-4': true, 'accent--text': true },
            dialog: false,
            /* table */
            headers: [{ text: 'ID', value: 'id', align: 'left', sortable: true }, { text: 'Name', value: 'name', align: 'left', sortable: true }, { text: 'Sponsor', value: 'sponsor.name', align: 'left', sortable: true }, { text: 'Referrak Link', value: 'referral_link.link', align: 'left', sortable: true }, { text: 'Roles', value: 'roles', align: 'left', sortable: false }],
            items: [],
            selected: [],
            pagination: {
                sortBy: 'name'
            },
            current_user: {},
            usersForm: new AppForm(App.forms.usersForm),
            toggleForm: new AppForm(App.forms.toggleForm),
            search: '',
            roles: [],
            permissions: [],
            rolesForm: new AppForm(App.forms.rolesForm),
            permissionsForm: new AppForm(App.forms.permissionsForm)
        };
    },
    watch: {
        items: {
            handler: function handler(newValue) {},
            deep: true
        },
        roles: function roles(newValue) {},
        permissions: function permissions(newValue) {}
    },
    mounted: function mounted() {
        var self = this;
        self.fetchRoles();
        self.fetchPermissions();
        self.fetchUsers();
    },

    methods: {
        activeLink: function activeLink(link) {
            return !!link;
        },
        activateLink: function () {
            var _ref = __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee(user) {
                var payload, message;
                return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return axios.get(route('api.user.link.activate', { id: user.id }));

                            case 3:
                                payload = _context.sent;

                                user.referral_link.active = true;
                                vm.$popup({ message: payload.data.message, backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' });
                                _context.next = 12;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context['catch'](0);
                                message = _context.t0.message;

                                if (message) {
                                    vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
                                }

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 8]]);
            }));

            function activateLink(_x) {
                return _ref.apply(this, arguments);
            }

            return activateLink;
        }(),
        deactivateLink: function () {
            var _ref3 = __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee2(user) {
                var payload, message;
                return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _context2.next = 3;
                                return axios.get(route('api.user.link.deactivate', { id: user.id }));

                            case 3:
                                payload = _context2.sent;

                                user.referral_link.active = false;
                                vm.$popup({ message: payload.data.message, backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' });
                                _context2.next = 12;
                                break;

                            case 8:
                                _context2.prev = 8;
                                _context2.t0 = _context2['catch'](0);
                                message = _context2.t0.message;

                                if (message) {
                                    vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
                                }

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 8]]);
            }));

            function deactivateLink(_x2) {
                return _ref3.apply(this, arguments);
            }

            return deactivateLink;
        }(),
        fetchRoles: function () {
            var _ref5 = __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee3() {
                var self, payload, errors, message;
                return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                self = this;
                                _context3.prev = 1;
                                _context3.next = 4;
                                return axios.get(route('api.roles.index'));

                            case 4:
                                payload = _context3.sent;

                                self.roles = payload.data;
                                _context3.next = 14;
                                break;

                            case 8:
                                _context3.prev = 8;
                                _context3.t0 = _context3['catch'](1);
                                errors = _context3.t0.errors;
                                message = _context3.t0.message;

                                if (errors) {
                                    console.log('fetchRoles:errors', errors);
                                }
                                if (message) {
                                    console.log('fetchRoles:error-message', message);
                                }

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 8]]);
            }));

            function fetchRoles() {
                return _ref5.apply(this, arguments);
            }

            return fetchRoles;
        }(),
        fetchPermissions: function () {
            var _ref7 = __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee4() {
                var self, payload, errors, message;
                return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                self = this;
                                _context4.prev = 1;
                                _context4.next = 4;
                                return axios.get(route('api.permissions.index'));

                            case 4:
                                payload = _context4.sent;

                                self.permissions = payload.data;
                                _context4.next = 14;
                                break;

                            case 8:
                                _context4.prev = 8;
                                _context4.t0 = _context4['catch'](1);
                                errors = _context4.t0.errors;
                                message = _context4.t0.message;

                                if (errors) {
                                    console.log('fetchRoles:errors', errors);
                                }
                                if (message) {
                                    console.log('fetchRoles:error-message', message);
                                }

                            case 14:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[1, 8]]);
            }));

            function fetchPermissions() {
                return _ref7.apply(this, arguments);
            }

            return fetchPermissions;
        }(),
        fetchUsers: function () {
            var _ref9 = __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee5() {
                var self, payload, errors, message;
                return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                self = this;

                                self.usersForm.busy = true;
                                _context5.prev = 2;
                                _context5.next = 5;
                                return App.post(route('api.user.index'), self.usersForm);

                            case 5:
                                payload = _context5.sent;

                                self.items = payload.data;
                                self.usersForm = new AppForm(App.forms.usersForm);
                                vm.$popup({ message: 'Users Loaded!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' });
                                _context5.next = 18;
                                break;

                            case 11:
                                _context5.prev = 11;
                                _context5.t0 = _context5['catch'](2);
                                errors = _context5.t0.errors;
                                message = _context5.t0.message;

                                if (errors) {
                                    self.usersForm.errors.set(errors);
                                }
                                if (message) {
                                    vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
                                }
                                self.usersForm.busy = false;

                            case 18:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[2, 11]]);
            }));

            function fetchUsers() {
                return _ref9.apply(this, arguments);
            }

            return fetchUsers;
        }(),
        deleteUser: function deleteUser(user) {
            var self = this;
            /* delete item */
            // you cant delete an admin account
            // but we can only downgrade it to other role
            // except if your email is = admin@
            var index = _.findIndex(self.items, { id: user.id });
            self.$delete(self.items, index);
        },
        toProperCase: function toProperCase(key) {
            var newStr = key.replace(/_/g, ' ');
            return newStr.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        changeRoles: function () {
            var _ref11 = __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee6(item) {
                var self, payload, message;
                return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                self = this;

                                self.rolesForm.roles = item.roles;
                                _context6.prev = 2;

                                self.rolesForm.busy = true;
                                _context6.next = 6;
                                return App.post(route('api.user.roles.sync', { id: item.id }), self.rolesForm);

                            case 6:
                                payload = _context6.sent;

                                item.permissions = payload.data.permissions;
                                self.rolesForm.busy = false;
                                self.rolesForm = new AppForm(App.forms.rolesForm);
                                vm.$popup({ message: payload.message, backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' });
                                _context6.next = 18;
                                break;

                            case 13:
                                _context6.prev = 13;
                                _context6.t0 = _context6['catch'](2);
                                message = _context6.t0.message;

                                if (message) {
                                    vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
                                }
                                self.rolesForm.busy = false;

                            case 18:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[2, 13]]);
            }));

            function changeRoles(_x3) {
                return _ref11.apply(this, arguments);
            }

            return changeRoles;
        }(),
        removeRole: function removeRole(role, roles) {
            roles.splice(roles.indexOf(role), 1);
            roles = [].concat(__WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_toConsumableArray___default()(roles));
        },
        changePermissions: function () {
            var _ref13 = __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee7(item) {
                var self, payload, message;
                return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                /* make ajax call to update permissions to this user */
                                self = this;

                                self.permissionsForm.permissions = item.permissions;
                                _context7.prev = 2;

                                self.permissionsForm.busy = true;
                                _context7.next = 6;
                                return App.post(route('api.user.permissions.sync', { id: item.id }), self.permissionsForm);

                            case 6:
                                payload = _context7.sent;

                                self.permissionsForm.busy = false;
                                self.permissionsForm = new AppForm(App.forms.permissionsForm);
                                vm.$popup({ message: payload.message, backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' });
                                _context7.next = 17;
                                break;

                            case 12:
                                _context7.prev = 12;
                                _context7.t0 = _context7['catch'](2);
                                message = _context7.t0.message;

                                if (message) {
                                    vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
                                }
                                self.permissionsForm.busy = false;

                            case 17:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[2, 12]]);
            }));

            function changePermissions(_x4) {
                return _ref13.apply(this, arguments);
            }

            return changePermissions;
        }(),
        removePermission: function removePermission(permission, permissions) {
            permissions.splice(permissions.indexOf(permission), 1);
            permissions = [].concat(__WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_toConsumableArray___default()(permissions));
        },
        deleteAll: function deleteAll() {
            this.items = [];
            this.selected = [];
        },
        deleteSelected: function deleteSelected() {
            var self = this;
            var newItems = _.difference(self.items, self.selected);
            self.items = newItems;
            self.selected = [];
            //! Send Api Call To Delete The Social Account
        },
        toggleAll: function toggleAll() {
            if (this.selected.length) this.selected = [];else this.selected = this.items.slice();
        }
    }
});

/***/ }),

/***/ 826:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(827);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),

/***/ 827:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(828), __esModule: true };

/***/ }),

/***/ 828:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(134);
__webpack_require__(829);
module.exports = __webpack_require__(31).Array.from;


/***/ }),

/***/ 829:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(68);
var $export = __webpack_require__(61);
var toObject = __webpack_require__(318);
var call = __webpack_require__(320);
var isArrayIter = __webpack_require__(321);
var toLength = __webpack_require__(135);
var createProperty = __webpack_require__(830);
var getIterFn = __webpack_require__(322);

$export($export.S + $export.F * !__webpack_require__(323)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ 830:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(39);
var createDesc = __webpack_require__(69);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ 831:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "main-layout",
    [
      _c(
        "v-container",
        { attrs: { fluid: "" } },
        [
          _c(
            "v-card",
            { attrs: { light: "", flat: "" } },
            [
              _c(
                "v-card-title",
                [
                  _c("v-text-field", {
                    attrs: {
                      "append-icon": "search",
                      label: "Search Users",
                      "single-line": "",
                      "hide-details": "",
                      light: ""
                    },
                    model: {
                      value: _vm.search,
                      callback: function($$v) {
                        _vm.search = $$v
                      },
                      expression: "search"
                    }
                  })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("v-data-table", {
            attrs: {
              headers: _vm.headers,
              items: _vm.items,
              search: _vm.search,
              "select-all": "",
              light: "",
              "item-key": "id",
              pagination: _vm.pagination,
              expand: ""
            },
            on: {
              "update:pagination": function($event) {
                _vm.pagination = $event
              }
            },
            scopedSlots: _vm._u([
              {
                key: "headers",
                fn: function(props) {
                  return [
                    _c(
                      "tr",
                      [
                        _c(
                          "th",
                          [
                            _c("v-checkbox", {
                              attrs: {
                                light: "",
                                primary: "",
                                "hide-details": "",
                                "input-value": props.all,
                                indeterminate: props.indeterminate
                              },
                              nativeOn: {
                                click: function($event) {
                                  _vm.toggleAll($event)
                                }
                              }
                            })
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _vm._l(props.headers, function(header) {
                          return _c(
                            "th",
                            {
                              key: header.text,
                              class: [
                                "column sortable",
                                _vm.pagination.descending ? "desc" : "asc",
                                header.value === _vm.pagination.sortBy
                                  ? "name"
                                  : "",
                                {
                                  "text-xs-left": header.align === "left",
                                  "text-xs-right": header.align === "right",
                                  "text-xs-center": header.align === "center"
                                },
                                _vm.$vuetify.breakpoint.width >= 600 && "title"
                              ],
                              on: {
                                click: function($event) {
                                  _vm.changeSort(header.value)
                                }
                              }
                            },
                            [
                              _c("v-icon", [_vm._v("arrow_upward")]),
                              _vm._v(
                                "\n            " +
                                  _vm._s(header.text) +
                                  "\n          "
                              )
                            ],
                            1
                          )
                        }),
                        _vm._v(" "),
                        _c(
                          "th",
                          { attrs: { "text-xs-right": "" } },
                          [
                            _vm.selected.length < 1
                              ? _c(
                                  "span",
                                  {
                                    class:
                                      _vm.$vuetify.breakpoint.width >= 600 &&
                                      "title"
                                  },
                                  [
                                    _vm._v(
                                      "\n              Actions\n            "
                                    )
                                  ]
                                )
                              : _c(
                                  "v-btn",
                                  {
                                    attrs: {
                                      flat: "",
                                      icon: "",
                                      color: "error"
                                    },
                                    nativeOn: {
                                      click: function($event) {
                                        _vm.deleteSelected()
                                      }
                                    }
                                  },
                                  [_c("v-icon", [_vm._v("fa-trash")])],
                                  1
                                )
                          ],
                          1
                        )
                      ],
                      2
                    )
                  ]
                }
              },
              {
                key: "items",
                fn: function(props) {
                  return [
                    _c("tr", [
                      _c(
                        "td",
                        { staticClass: "title text-xs-left" },
                        [
                          _c("v-checkbox", {
                            attrs: {
                              active: props.selected,
                              "input-value": props.selected
                            },
                            on: {
                              click: function($event) {
                                props.selected = !props.selected
                              }
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "td",
                        { staticClass: "title text-xs-left accent--text" },
                        [
                          _vm._v(
                            "\n            " +
                              _vm._s(props.item.id) +
                              "\n          "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "td",
                        { staticClass: "title text-xs-left accent--text" },
                        [
                          _vm._v(
                            "\n            " +
                              _vm._s(props.item.name) +
                              "\n          "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "td",
                        { staticClass: "title text-xs-left accent--text" },
                        [
                          props.item.sponsor
                            ? _c("v-avatar", [
                                _c("img", {
                                  attrs: {
                                    src: props.item.sponsor.photo_url,
                                    alt: props.item.sponsor.name
                                  }
                                })
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          props.item.sponsor
                            ? _c("span", [
                                _vm._v(_vm._s(props.item.sponsor.name))
                              ])
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "td",
                        { staticClass: "title text-xs-left accent--text" },
                        [
                          _vm.activeLink(props.item.referral_link.active)
                            ? _c(
                                "v-btn",
                                {
                                  attrs: {
                                    flat: "",
                                    color: "cyan",
                                    href:
                                      "http://" +
                                      props.item.referral_link.link +
                                      "." +
                                      _vm.App.site.domain,
                                    target: "_blank"
                                  }
                                },
                                [
                                  _c("v-icon", { attrs: { left: "" } }, [
                                    _vm._v("fa-link")
                                  ]),
                                  _vm._v(" "),
                                  _c("span", [
                                    _vm._v(
                                      _vm._s(props.item.referral_link.link)
                                    )
                                  ])
                                ],
                                1
                              )
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "td",
                        { staticClass: "title text-xs-left accent--text" },
                        _vm._l(props.item.roles, function(role, key) {
                          return _c(
                            "v-chip",
                            { key: key, attrs: { dark: "" } },
                            [
                              _c(
                                "v-avatar",
                                {
                                  class: {
                                    error: role === "admin",
                                    "white--text": true,
                                    accent: role === "customer",
                                    brown: role === "merchant",
                                    "blue-grey": role === "reseller"
                                  }
                                },
                                [
                                  _c("span", { staticClass: "headline" }, [
                                    _vm._v(_vm._s(role.charAt(0).toUpperCase()))
                                  ])
                                ]
                              ),
                              _vm._v(
                                "\n              " +
                                  _vm._s(role) +
                                  "\n            "
                              )
                            ],
                            1
                          )
                        })
                      ),
                      _vm._v(" "),
                      _c(
                        "td",
                        { staticClass: "title text-xs-center" },
                        [
                          _c(
                            "v-btn",
                            {
                              class: {
                                "amber--text": props.expanded,
                                amber: props.expanded,
                                teal: !props.expanded,
                                "teal--text": !props.expanded
                              },
                              attrs: { light: "", flat: "", icon: "" },
                              on: {
                                click: function($event) {
                                  props.expanded = !props.expanded
                                }
                              }
                            },
                            [
                              !props.expanded
                                ? _c("v-icon", [_vm._v("fa-expand")])
                                : _vm._e(),
                              _vm._v(" "),
                              props.expanded
                                ? _c("v-icon", [_vm._v("fa-compress")])
                                : _vm._e()
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: !_vm.can("delete_user"),
                                flat: "",
                                icon: "",
                                color: "error"
                              },
                              nativeOn: {
                                click: function($event) {
                                  _vm.deleteUser(props.item)
                                }
                              }
                            },
                            [_c("v-icon", [_vm._v("fa-trash")])],
                            1
                          )
                        ],
                        1
                      )
                    ])
                  ]
                }
              },
              {
                key: "pageText",
                fn: function(ref) {
                  var pageStart = ref.pageStart
                  var pageStop = ref.pageStop
                  return [
                    _vm._v(
                      "\n        From " +
                        _vm._s(pageStart) +
                        " to " +
                        _vm._s(pageStop) +
                        "\n      "
                    )
                  ]
                }
              },
              {
                key: "expand",
                fn: function(props) {
                  return [
                    _c(
                      "v-container",
                      { attrs: { fluid: "" } },
                      [
                        _c(
                          "v-card",
                          {
                            attrs: { light: "", flat: "", "text-xs-center": "" }
                          },
                          [
                            _c(
                              "v-card-media",
                              {
                                staticClass: "white--text blue-grey",
                                attrs: { height: "75px" }
                              },
                              [
                                _c(
                                  "v-container",
                                  { attrs: { "fill-height": "", fluid: "" } },
                                  [
                                    _c(
                                      "v-layout",
                                      { attrs: { "fill-height": "" } },
                                      [
                                        _c(
                                          "v-flex",
                                          {
                                            attrs: {
                                              xs12: "",
                                              "align-end": "",
                                              flexbox: ""
                                            }
                                          },
                                          [
                                            _c(
                                              "v-avatar",
                                              { attrs: { "text-xs-left": "" } },
                                              [
                                                _c("img", {
                                                  attrs: {
                                                    src: props.item.photo_url,
                                                    alt: props.item.name
                                                  }
                                                })
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "span",
                                              { staticClass: "headline" },
                                              [_vm._v(_vm._s(props.item.name))]
                                            )
                                          ],
                                          1
                                        )
                                      ],
                                      1
                                    )
                                  ],
                                  1
                                )
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c(
                              "v-card-actions",
                              [
                                !props.item.referral_link.active
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { flat: "", color: "success" },
                                        on: {
                                          click: function($event) {
                                            _vm.activateLink(props.item)
                                          }
                                        }
                                      },
                                      [
                                        _vm._v(
                                          "\n                Activate Link \n                "
                                        ),
                                        _c("v-icon", { attrs: { right: "" } }, [
                                          _vm._v("done_all")
                                        ])
                                      ],
                                      1
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                props.item.referral_link.active
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { flat: "", color: "error" },
                                        on: {
                                          click: function($event) {
                                            _vm.deactivateLink(props.item)
                                          }
                                        }
                                      },
                                      [
                                        _vm._v(
                                          "\n                Deactivate Link \n                "
                                        ),
                                        _c("v-icon", { attrs: { right: "" } }, [
                                          _vm._v("fa-ban ")
                                        ])
                                      ],
                                      1
                                    )
                                  : _vm._e()
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c(
                              "v-card-title",
                              [
                                _c(
                                  "v-container",
                                  { attrs: { fluid: "" } },
                                  [
                                    _c(
                                      "p",
                                      { staticClass: "title accent--text" },
                                      [_vm._v("Account Details")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "v-layout",
                                      { attrs: { row: "", wrap: "" } },
                                      [
                                        _c(
                                          "v-flex",
                                          { attrs: { xs12: "" } },
                                          [
                                            _c("v-text-field", {
                                              attrs: {
                                                label: "Username",
                                                "prepend-icon": "fa-at",
                                                light: "",
                                                readonly: ""
                                              },
                                              model: {
                                                value: props.item.username,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    props.item,
                                                    "username",
                                                    $$v
                                                  )
                                                },
                                                expression:
                                                  "props.item.username"
                                              }
                                            })
                                          ],
                                          1
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "v-flex",
                                          { attrs: { xs12: "" } },
                                          [
                                            _c("v-text-field", {
                                              attrs: {
                                                label: "Email",
                                                "prepend-icon": "fa-envelope",
                                                light: "",
                                                readonly: ""
                                              },
                                              model: {
                                                value: props.item.email,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    props.item,
                                                    "email",
                                                    $$v
                                                  )
                                                },
                                                expression: "props.item.email"
                                              }
                                            })
                                          ],
                                          1
                                        )
                                      ],
                                      1
                                    ),
                                    _vm._v(" "),
                                    props.item.roles
                                      ? _c(
                                          "p",
                                          { staticClass: "title accent--text" },
                                          [
                                            _vm._v(
                                              "\n                  Assigned Roles\n                "
                                            )
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "v-layout",
                                      { attrs: { row: "", wrap: "" } },
                                      [
                                        _c(
                                          "v-flex",
                                          { attrs: { xs12: "" } },
                                          [
                                            _c("v-select", {
                                              attrs: {
                                                color: "blue-grey",
                                                items: _vm.roles,
                                                light: "",
                                                chips: "",
                                                tags: "",
                                                disabled: props.item.id === 1,
                                                clearable: "",
                                                "deletable-chips": "",
                                                "prepend-icon": "fa-tags"
                                              },
                                              on: {
                                                input: function($event) {
                                                  _vm.changeRoles(props.item)
                                                }
                                              },
                                              scopedSlots: _vm._u([
                                                {
                                                  key: "selection",
                                                  fn: function(data) {
                                                    return [
                                                      _c(
                                                        "v-chip",
                                                        {
                                                          attrs: {
                                                            light: "",
                                                            close: "",
                                                            selected:
                                                              data.selected
                                                          },
                                                          on: {
                                                            input: function(
                                                              $event
                                                            ) {
                                                              _vm.removeRole(
                                                                data.item,
                                                                props.item.roles
                                                              )
                                                            }
                                                          }
                                                        },
                                                        [
                                                          _c(
                                                            "v-avatar",
                                                            {
                                                              staticClass:
                                                                "blue-grey white--text"
                                                            },
                                                            [
                                                              _c(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "headline"
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      data.item
                                                                        .charAt(
                                                                          0
                                                                        )
                                                                        .toUpperCase()
                                                                    )
                                                                  )
                                                                ]
                                                              )
                                                            ]
                                                          ),
                                                          _vm._v(
                                                            "\n                          " +
                                                              _vm._s(
                                                                data.item
                                                              ) +
                                                              "\n                        "
                                                          )
                                                        ],
                                                        1
                                                      )
                                                    ]
                                                  }
                                                }
                                              ]),
                                              model: {
                                                value: props.item.roles,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    props.item,
                                                    "roles",
                                                    $$v
                                                  )
                                                },
                                                expression: "props.item.roles"
                                              }
                                            })
                                          ],
                                          1
                                        )
                                      ],
                                      1
                                    ),
                                    _vm._v(" "),
                                    props.item.permissions
                                      ? _c(
                                          "p",
                                          { staticClass: "title accent--text" },
                                          [
                                            _vm._v(
                                              "\n                  Role Inherited Permissions\n                "
                                            )
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "v-layout",
                                      { attrs: { row: "", wrap: "" } },
                                      [
                                        _c(
                                          "v-flex",
                                          { attrs: { xs12: "" } },
                                          [
                                            _c("v-select", {
                                              attrs: {
                                                color: "brown",
                                                items: _vm.permissions,
                                                light: "",
                                                disabled: "",
                                                tags: "",
                                                "prepend-icon": "fa-tags"
                                              },
                                              scopedSlots: _vm._u([
                                                {
                                                  key: "selection",
                                                  fn: function(data) {
                                                    return [
                                                      _c(
                                                        "v-chip",
                                                        {
                                                          attrs: {
                                                            light: "",
                                                            selected:
                                                              data.selected
                                                          }
                                                        },
                                                        [
                                                          _c(
                                                            "v-avatar",
                                                            {
                                                              staticClass:
                                                                "primary white--text"
                                                            },
                                                            [
                                                              _c(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "headline"
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      data.item
                                                                        .charAt(
                                                                          0
                                                                        )
                                                                        .toUpperCase()
                                                                    )
                                                                  )
                                                                ]
                                                              )
                                                            ]
                                                          ),
                                                          _vm._v(
                                                            "\n                          " +
                                                              _vm._s(
                                                                data.item
                                                              ) +
                                                              "\n                        "
                                                          )
                                                        ],
                                                        1
                                                      )
                                                    ]
                                                  }
                                                }
                                              ]),
                                              model: {
                                                value: props.item.permissions,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    props.item,
                                                    "permissions",
                                                    $$v
                                                  )
                                                },
                                                expression:
                                                  "props.item.permissions"
                                              }
                                            })
                                          ],
                                          1
                                        )
                                      ],
                                      1
                                    ),
                                    _vm._v(" "),
                                    props.item.profile
                                      ? _c(
                                          "p",
                                          { staticClass: "title accent--text" },
                                          [
                                            _vm._v(
                                              "\n                  Profile Details\n                "
                                            )
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "v-layout",
                                      { attrs: { row: "", wrap: "" } },
                                      _vm._l(props.item.profile, function(
                                        profile,
                                        key
                                      ) {
                                        return _c(
                                          "v-flex",
                                          { key: key, attrs: { xs12: "" } },
                                          [
                                            _c("v-text-field", {
                                              attrs: {
                                                label: _vm.toProperCase(key),
                                                value: profile,
                                                light: "",
                                                readonly: ""
                                              }
                                            })
                                          ],
                                          1
                                        )
                                      })
                                    )
                                  ],
                                  1
                                )
                              ],
                              1
                            )
                          ],
                          1
                        )
                      ],
                      1
                    )
                  ]
                }
              }
            ]),
            model: {
              value: _vm.selected,
              callback: function($$v) {
                _vm.selected = $$v
              },
              expression: "selected"
            }
          })
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2de69fbe", module.exports)
  }
}

/***/ })

});