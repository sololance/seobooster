webpackJsonp([0],{

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(942)
/* template */
var __vue_template__ = __webpack_require__(981)
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
Component.options.__file = "resources\\assets\\js\\pages\\Traffic.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-58b73554", Component.options)
  } else {
    hotAPI.reload("data-v-58b73554", Component.options)
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

/***/ 691:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(694)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(696)
/* template */
var __vue_template__ = __webpack_require__(703)
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
Component.options.__file = "resources\\assets\\js\\components\\TextEditor.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b3f9ab1", Component.options)
  } else {
    hotAPI.reload("data-v-4b3f9ab1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 692:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(704)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(706)
/* template */
var __vue_template__ = __webpack_require__(707)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0cdd7a0a"
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
Component.options.__file = "resources\\assets\\js\\components\\UploadButton.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0cdd7a0a", Component.options)
  } else {
    hotAPI.reload("data-v-0cdd7a0a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 694:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(695);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("73888f36", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b3f9ab1\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./TextEditor.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b3f9ab1\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./TextEditor.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 695:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 696:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg__ = __webpack_require__(697);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg_dist_ui_trumbowyg_css__ = __webpack_require__(700);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg_dist_ui_trumbowyg_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_trumbowyg_dist_ui_trumbowyg_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_plugins_noembed_trumbowyg_noembed_min_js__ = __webpack_require__(702);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_plugins_noembed_trumbowyg_noembed_min_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_plugins_noembed_trumbowyg_noembed_min_js__);
//
//
//
//
//
//
//
//





// import 'trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js'
// import 'trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.css'
// import 'trumbowyg/dist/plugins/base64/trumbowyg.base64.min.js'
// import '../plugins/trumbowyg.upload.js'

/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        trumbowyg: __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg___default.a
    },
    //* html = content
    //* disabled = disabled
    //* trumbowyg = current instance of trumbowyg
    props: {
        html: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: true
        },
        uploadLink: {
            type: String,
            default: function _default() {
                return '';
            }
        },
        id: {
            type: String,
            required: true
        }
    },
    data: function data() {
        return {
            content: '',
            trumbowyg: null,
            // ? Configuration : https://alex-d.github.io/Trumbowyg/documentation/#use-plugins
            config: {
                advanced: {
                    disabled: false,
                    autogrow: true,
                    removeformatPasted: true,
                    autogrowOnEnter: false,
                    resetCss: true,
                    //! Customized Visible Buttons
                    btns: [['viewHTML'], ['undo'], ['redo'],
                    // ['foreColor'], ['backColor'],
                    ['fontstyle'], ['formatting'], ['alignments'], ['scripts'], ['lists'], ['embeds'], ['links'], ['horizontalRule'], ['removeformat'], ['fullscreen']],
                    //! Customized Buttons Groups
                    btnsDef: {
                        'fontstyle': {
                            title: 'Bold, Italic, Underline, and Strikethrough',
                            dropdown: ['strong', 'em', 'underline', 'strikethrough'],
                            ico: 'strong',
                            hasIcon: true
                        },
                        'scripts': {
                            title: 'Superscript and Subscript',
                            dropdown: ['superscript', 'subscript'],
                            ico: 'superscript',
                            hasIcon: true
                        },
                        'lists': {
                            title: 'Unordered List and Ordered List',
                            dropdown: ['unorderedList', 'orderedList'],
                            ico: 'unorderedList',
                            hasIcon: true
                        },
                        'links': {
                            title: 'Add Link and Remove Link',
                            dropdown: ['createLink', 'unlink'],
                            ico: 'createLink',
                            hasIcon: true
                        },
                        'alignments': {
                            title: 'Align Left, Center, Right , and Justify',
                            dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                            ico: 'justifyCenter'
                        },
                        'embeds': {
                            title: 'Attach Image and Video',
                            //! removed base64 , 'upload'
                            dropdown: ['insertImage', 'noembed'],
                            ico: 'insertImage',
                            hasIcon: true
                        }
                    }
                } // End of Configs

            } };
    },
    watch: {
        //* Whenever Parent Change Active Props Update Config
        // ? Useful For Disabling Text Editor
        'config.advanced.disabled': function configAdvancedDisabled() {
            var self = this;
            if (self.config.advanced.disabled === true) {
                $('#' + self.id).trumbowyg('disable');
            } else {
                $('#' + self.id).trumbowyg('enable');
            }
        },
        content: function content(newValue) {
            var self = this;
            Bus.$emit(self.id + '-updated', newValue);
        },
        html: function html(newValue) {
            var self = this;
            self.content = newValue;
        }
    },
    mounted: function mounted() {
        var self = this;
        //* Initialized Text Editor Component Data From Props
        self.config.advanced.disabled = self.disabled ? self.disabled : false;
        //* Listen For Upload File Event
        // ? Desctructure payload --> $modal && values
        Bus.$on('upload-file', function () {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : payload,
                data = _ref.data,
                trumbowyg = _ref.trumbowyg;

            self.trumbowyg = trumbowyg;
            self.uploadImage(data);
        });
    },

    methods: {
        uploadImage: function uploadImage(form) {
            var self = this;
            axios.post(self.uploadLink, form).then(function (response) {
                self.trumbowyg.execCmd('insertImage', response.data.url);
                //* Attach Uploaded Image , Newly Created Link To Text Editor Component
                $('img[src="' + response.data.url + '"]:not([alt])', __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg___default.a.$box).attr('alt', response.data.description);
                self.trumbowyg.closeModal();
                self.trumbowyg.$c.trigger('tbwuploadsuccess', [self.trumbowyg, form, response.data.url]);
            }).catch(function () {
                self.$popup({ message: 'Oops! Sorry, Cant Upload Image.', backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
            });
        }
    }
});

/***/ }),

/***/ 697:
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(133), __webpack_require__(698), __webpack_require__(699));
	else if(typeof define === 'function' && define.amd)
		define("VueTrumbowyg", ["jquery", "trumbowyg", "trumbowyg/dist/ui/icons.svg"], factory);
	else if(typeof exports === 'object')
		exports["VueTrumbowyg"] = factory(require("jquery"), require("trumbowyg"), require("trumbowyg/dist/ui/icons.svg"));
	else
		root["VueTrumbowyg"] = factory(root["jQuery"], root["trumbowyg"], root["trumbowyg/dist/ui/icons.svg"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trumbowygPlugin", function() { return trumbowygPlugin; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__component_vue__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "component", function() { return __WEBPACK_IMPORTED_MODULE_0__component_vue__["a"]; });


var trumbowygPlugin = function trumbowygPlugin(Vue, params) {
  var name = 'trumbowyg';
  if (typeof params === 'string') name = params;

  Vue.component(name, __WEBPACK_IMPORTED_MODULE_0__component_vue__["a" /* default */]);
};

__WEBPACK_IMPORTED_MODULE_0__component_vue__["a" /* default */].install = trumbowygPlugin;

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__component_vue__["a" /* default */]);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_component_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37154406_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_component_vue__ = __webpack_require__(7);
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_component_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37154406_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_component_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_trumbowyg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//




// You have to import css yourself

// You have to configure webpack to load svg files


// https://alex-d.github.io/Trumbowyg/documentation/#events
var events = ['focus', 'blur', 'change', 'resize', 'paste', 'openfullscreen', 'closefullscreen', 'close'];

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'trumbowyg',
  props: {
    value: {
      default: null,
      required: true,
      validator: function validator(value) {
        return value === null || typeof value === 'string' || value instanceof String;
      }
    },
    // http://alex-d.github.io/Trumbowyg/documentation.html#basic-options
    config: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // https://alex-d.github.io/Trumbowyg/documentation/#svg-icons
    svgPath: {
      type: [String, Boolean],
      default: __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg___default.a
    }
  },
  data: function data() {
    return {
      // jQuery DOM
      el: null
    };
  },
  mounted: function mounted() {
    // Return early if instance is already loaded
    if (this.el) return;

    // Store DOM
    this.el = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this.$el);

    // Init editor with config
    this.el.trumbowyg(_extends({ svgPath: this.svgPath }, this.config));
    // Set initial value
    this.el.trumbowyg('html', this.value);

    // Watch for further changes
    this.el.on('tbwchange', this.onChange);

    // Workaround : trumbowyg does not trigger change event on Ctrl+V
    this.el.on('tbwpaste', this.onChange);

    // Register events
    this.registerEvents();
  },
  beforeDestroy: function beforeDestroy() {
    // Free up memory
    if (this.el) {
      this.el.trumbowyg('destroy');
      this.el = null;
    }
  },

  watch: {
    /**
     * Listen to change from outside of component and update DOM
     *
     * @param newValue String
     */
    value: function value(newValue) {
      if (this.el) {
        // Prevent multiple input events
        if (newValue === this.el.trumbowyg('html')) return;
        // Set new value
        this.el.trumbowyg('html', newValue);
      }
    }
  },
  methods: {
    /**
     * Emit input event with current editor value
     * This will update v-model on parent component
     * This method gets called when value gets changed by editor itself
     *
     * @param event
     */
    onChange: function onChange(event) {
      this.$emit('input', event.target.value);
    },


    /**
     * Emit all available events
     */
    registerEvents: function registerEvents() {
      var _this = this;

      events.forEach(function (name) {
        _this.el.on('tbw' + name, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this.$emit.apply(_this, ['tbw-' + name].concat(args));
        });
      });
    }
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('textarea')}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })
/******/ ]);
});

/***/ }),

/***/ 698:
/***/ (function(module, exports) {

/**
 * Trumbowyg v2.9.2 - A lightweight WYSIWYG editor
 * Trumbowyg core file
 * ------------------------
 * @link http://alex-d.github.io/Trumbowyg
 * @license MIT
 * @author Alexandre Demode (Alex-D)
 *         Twitter : @AlexandreDemode
 *         Website : alex-d.fr
 */

jQuery.trumbowyg = {
    langs: {
        en: {
            viewHTML: 'View HTML',

            undo: 'Undo',
            redo: 'Redo',

            formatting: 'Formatting',
            p: 'Paragraph',
            blockquote: 'Quote',
            code: 'Code',
            header: 'Header',

            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Stroke',
            underline: 'Underline',

            strong: 'Strong',
            em: 'Emphasis',
            del: 'Deleted',

            superscript: 'Superscript',
            subscript: 'Subscript',

            unorderedList: 'Unordered list',
            orderedList: 'Ordered list',

            insertImage: 'Insert Image',
            link: 'Link',
            createLink: 'Insert link',
            unlink: 'Remove link',

            justifyLeft: 'Align Left',
            justifyCenter: 'Align Center',
            justifyRight: 'Align Right',
            justifyFull: 'Align Justify',

            horizontalRule: 'Insert horizontal rule',
            removeformat: 'Remove format',

            fullscreen: 'Fullscreen',

            close: 'Close',

            submit: 'Confirm',
            reset: 'Cancel',

            required: 'Required',
            description: 'Description',
            title: 'Title',
            text: 'Text',
            target: 'Target',
            width: 'Width'
        }
    },

    // Plugins
    plugins: {},

    // SVG Path globally
    svgPath: null,

    hideButtonTexts: null
};

// Makes default options read-only
Object.defineProperty(jQuery.trumbowyg, 'defaultOptions', {
    value: {
        lang: 'en',

        fixedBtnPane: false,
        fixedFullWidth: false,
        autogrow: false,
        autogrowOnEnter: false,
        imageWidthModalEdit: false,

        prefix: 'trumbowyg-',

        semantic: true,
        resetCss: false,
        removeformatPasted: false,
        tagsToRemove: [],
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            ['insertImage'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['fullscreen']
        ],
        // For custom button definitions
        btnsDef: {},

        inlineElementsSelector: 'a,abbr,acronym,b,caption,cite,code,col,dfn,dir,dt,dd,em,font,hr,i,kbd,li,q,span,strikeout,strong,sub,sup,u',

        pasteHandlers: [],

        // imgDblClickHandler: default is defined in constructor

        plugins: {}
    },
    writable: false,
    enumerable: true,
    configurable: false
});


(function (navigator, window, document, $) {
    'use strict';

    var CONFIRM_EVENT = 'tbwconfirm',
        CANCEL_EVENT = 'tbwcancel';

    $.fn.trumbowyg = function (options, params) {
        var trumbowygDataName = 'trumbowyg';
        if (options === Object(options) || !options) {
            return this.each(function () {
                if (!$(this).data(trumbowygDataName)) {
                    $(this).data(trumbowygDataName, new Trumbowyg(this, options));
                }
            });
        }
        if (this.length === 1) {
            try {
                var t = $(this).data(trumbowygDataName);
                switch (options) {
                    // Exec command
                    case 'execCmd':
                        return t.execCmd(params.cmd, params.param, params.forceCss);

                    // Modal box
                    case 'openModal':
                        return t.openModal(params.title, params.content);
                    case 'closeModal':
                        return t.closeModal();
                    case 'openModalInsert':
                        return t.openModalInsert(params.title, params.fields, params.callback);

                    // Range
                    case 'saveRange':
                        return t.saveRange();
                    case 'getRange':
                        return t.range;
                    case 'getRangeText':
                        return t.getRangeText();
                    case 'restoreRange':
                        return t.restoreRange();

                    // Enable/disable
                    case 'enable':
                        return t.setDisabled(false);
                    case 'disable':
                        return t.setDisabled(true);

                    // Toggle
                    case 'toggle':
                        return t.toggle();

                    // Destroy
                    case 'destroy':
                        return t.destroy();

                    // Empty
                    case 'empty':
                        return t.empty();

                    // HTML
                    case 'html':
                        return t.html(params);
                }
            } catch (c) {
            }
        }

        return false;
    };

    // @param: editorElem is the DOM element
    var Trumbowyg = function (editorElem, options) {
        var t = this,
            trumbowygIconsId = 'trumbowyg-icons',
            $trumbowyg = $.trumbowyg;

        // Get the document of the element. It use to makes the plugin
        // compatible on iframes.
        t.doc = editorElem.ownerDocument || document;

        // jQuery object of the editor
        t.$ta = $(editorElem); // $ta : Textarea
        t.$c = $(editorElem); // $c : creator

        options = options || {};

        // Localization management
        if (options.lang != null || $trumbowyg.langs[options.lang] != null) {
            t.lang = $.extend(true, {}, $trumbowyg.langs.en, $trumbowyg.langs[options.lang]);
        } else {
            t.lang = $trumbowyg.langs.en;
        }

        t.hideButtonTexts = $trumbowyg.hideButtonTexts != null ? $trumbowyg.hideButtonTexts : options.hideButtonTexts;

        // SVG path
        var svgPathOption = $trumbowyg.svgPath != null ? $trumbowyg.svgPath : options.svgPath;
        t.hasSvg = svgPathOption !== false;
        t.svgPath = !!t.doc.querySelector('base') ? window.location.href.split('#')[0] : '';
        if ($('#' + trumbowygIconsId, t.doc).length === 0 && svgPathOption !== false) {
            if (svgPathOption == null) {
                // Hack to get svgPathOption based on trumbowyg.js path
                var scriptElements = document.getElementsByTagName('script');
                for (var i = 0; i < scriptElements.length; i += 1) {
                    var source = scriptElements[i].src;
                    var matches = source.match('trumbowyg(\.min)?\.js');
                    if (matches != null) {
                        svgPathOption = source.substring(0, source.indexOf(matches[0])) + '/ui/icons.svg';
                    }
                }
                if (svgPathOption == null) {
                    console.warn('You must define svgPath: https://goo.gl/CfTY9U'); // jshint ignore:line
                }
            }

            var div = t.doc.createElement('div');
            div.id = trumbowygIconsId;
            t.doc.body.insertBefore(div, t.doc.body.childNodes[0]);
            $.ajax({
                async: true,
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'xml',
                crossDomain: true,
                url: svgPathOption,
                data: null,
                beforeSend: null,
                complete: null,
                success: function (data) {
                    div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
                }
            });
        }


        /**
         * When the button is associated to a empty object
         * fn and title attributs are defined from the button key value
         *
         * For example
         *      foo: {}
         * is equivalent to :
         *      foo: {
         *          fn: 'foo',
         *          title: this.lang.foo
         *      }
         */
        var h = t.lang.header, // Header translation
            isBlinkFunction = function () {
                return (window.chrome || (window.Intl && Intl.v8BreakIterator)) && 'CSS' in window;
            };
        t.btnsDef = {
            viewHTML: {
                fn: 'toggle'
            },

            undo: {
                isSupported: isBlinkFunction,
                key: 'Z'
            },
            redo: {
                isSupported: isBlinkFunction,
                key: 'Y'
            },

            p: {
                fn: 'formatBlock'
            },
            blockquote: {
                fn: 'formatBlock'
            },
            h1: {
                fn: 'formatBlock',
                title: h + ' 1'
            },
            h2: {
                fn: 'formatBlock',
                title: h + ' 2'
            },
            h3: {
                fn: 'formatBlock',
                title: h + ' 3'
            },
            h4: {
                fn: 'formatBlock',
                title: h + ' 4'
            },
            subscript: {
                tag: 'sub'
            },
            superscript: {
                tag: 'sup'
            },

            bold: {
                key: 'B',
                tag: 'b'
            },
            italic: {
                key: 'I',
                tag: 'i'
            },
            underline: {
                tag: 'u'
            },
            strikethrough: {
                tag: 'strike'
            },

            strong: {
                fn: 'bold',
                key: 'B'
            },
            em: {
                fn: 'italic',
                key: 'I'
            },
            del: {
                fn: 'strikethrough'
            },

            createLink: {
                key: 'K',
                tag: 'a'
            },
            unlink: {},

            insertImage: {},

            justifyLeft: {
                tag: 'left',
                forceCss: true
            },
            justifyCenter: {
                tag: 'center',
                forceCss: true
            },
            justifyRight: {
                tag: 'right',
                forceCss: true
            },
            justifyFull: {
                tag: 'justify',
                forceCss: true
            },

            unorderedList: {
                fn: 'insertUnorderedList',
                tag: 'ul'
            },
            orderedList: {
                fn: 'insertOrderedList',
                tag: 'ol'
            },

            horizontalRule: {
                fn: 'insertHorizontalRule'
            },

            removeformat: {},

            fullscreen: {
                class: 'trumbowyg-not-disable'
            },
            close: {
                fn: 'destroy',
                class: 'trumbowyg-not-disable'
            },

            // Dropdowns
            formatting: {
                dropdown: ['p', 'blockquote', 'h1', 'h2', 'h3', 'h4'],
                ico: 'p'
            },
            link: {
                dropdown: ['createLink', 'unlink']
            }
        };

        // Defaults Options
        t.o = $.extend(true, {}, $trumbowyg.defaultOptions, options);
        if (!t.o.hasOwnProperty('imgDblClickHandler')) {
            t.o.imgDblClickHandler = t.getDefaultImgDblClickHandler();
        }

        t.disabled = t.o.disabled || (editorElem.nodeName === 'TEXTAREA' && editorElem.disabled);

        if (options.btns) {
            t.o.btns = options.btns;
        } else if (!t.o.semantic) {
            t.o.btns[3] = ['bold', 'italic', 'underline', 'strikethrough'];
        }

        $.each(t.o.btnsDef, function (btnName, btnDef) {
            t.addBtnDef(btnName, btnDef);
        });

        // put this here in the event it would be merged in with options
        t.eventNamespace = 'trumbowyg-event';

        // Keyboard shortcuts are load in this array
        t.keys = [];

        // Tag to button dynamically hydrated
        t.tagToButton = {};
        t.tagHandlers = [];

        // Admit multiple paste handlers
        t.pasteHandlers = [].concat(t.o.pasteHandlers);

        // Check if browser is IE
        t.isIE = (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') !== -1);

        t.init();
    };

    Trumbowyg.prototype = {
        init: function () {
            var t = this;
            t.height = t.$ta.height();

            t.initPlugins();

            try {
                // Disable image resize, try-catch for old IE
                t.doc.execCommand('enableObjectResizing', false, false);
                t.doc.execCommand('defaultParagraphSeparator', false, 'p');
            } catch (e) {
            }

            t.buildEditor();
            t.buildBtnPane();

            t.fixedBtnPaneEvents();

            t.buildOverlay();

            setTimeout(function () {
                if (t.disabled) {
                    t.setDisabled(true);
                }
                t.$c.trigger('tbwinit');
            });
        },

        addBtnDef: function (btnName, btnDef) {
            this.btnsDef[btnName] = btnDef;
        },

        buildEditor: function () {
            var t = this,
                prefix = t.o.prefix,
                html = '';

            t.$box = $('<div/>', {
                class: prefix + 'box ' + prefix + 'editor-visible ' + prefix + t.o.lang + ' trumbowyg'
            });

            // $ta = Textarea
            // $ed = Editor
            t.isTextarea = t.$ta.is('textarea');
            if (t.isTextarea) {
                html = t.$ta.val();
                t.$ed = $('<div/>');
                t.$box
                    .insertAfter(t.$ta)
                    .append(t.$ed, t.$ta);
            } else {
                t.$ed = t.$ta;
                html = t.$ed.html();

                t.$ta = $('<textarea/>', {
                    name: t.$ta.attr('id'),
                    height: t.height
                }).val(html);

                t.$box
                    .insertAfter(t.$ed)
                    .append(t.$ta, t.$ed);
                t.syncCode();
            }

            t.$ta
                .addClass(prefix + 'textarea')
                .attr('tabindex', -1)
            ;

            t.$ed
                .addClass(prefix + 'editor')
                .attr({
                    contenteditable: true,
                    dir: t.lang._dir || 'ltr'
                })
                .html(html)
            ;

            if (t.o.tabindex) {
                t.$ed.attr('tabindex', t.o.tabindex);
            }

            if (t.$c.is('[placeholder]')) {
                t.$ed.attr('placeholder', t.$c.attr('placeholder'));
            }

            if (t.$c.is('[spellcheck]')) {
                t.$ed.attr('spellcheck', t.$c.attr('spellcheck'));
            }

            if (t.o.resetCss) {
                t.$ed.addClass(prefix + 'reset-css');
            }

            if (!t.o.autogrow) {
                t.$ta.add(t.$ed).css({
                    height: t.height
                });
            }

            t.semanticCode();

            if (t.o.autogrowOnEnter) {
                t.$ed.addClass(prefix + 'autogrow-on-enter');
            }

            var ctrl = false,
                composition = false,
                debounceButtonPaneStatus,
                updateEventName = t.isIE ? 'keyup' : 'input';

            t.$ed
                .on('dblclick', 'img', t.o.imgDblClickHandler)
                .on('keydown', function (e) {
                    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                        ctrl = true;
                        var key = t.keys[String.fromCharCode(e.which).toUpperCase()];

                        try {
                            t.execCmd(key.fn, key.param);
                            return false;
                        } catch (c) {
                        }
                    }
                })
                .on('compositionstart compositionupdate', function () {
                    composition = true;
                })
                .on(updateEventName + ' compositionend', function (e) {
                    if (e.type === 'compositionend') {
                        composition = false;
                    } else if (composition) {
                        return;
                    }

                    var keyCode = e.which;

                    if (keyCode >= 37 && keyCode <= 40) {
                        return;
                    }

                    if ((e.ctrlKey || e.metaKey) && (keyCode === 89 || keyCode === 90)) {
                        t.$c.trigger('tbwchange');
                    } else if (!ctrl && keyCode !== 17) {
                        t.semanticCode(false, e.type === 'compositionend' && keyCode === 13);
                        t.$c.trigger('tbwchange');
                    } else if (typeof e.which === 'undefined') {
                        t.semanticCode(false, false, true);
                    }

                    setTimeout(function () {
                        ctrl = false;
                    }, 200);
                })
                .on('mouseup keydown keyup', function (e) {
                    if ((!e.ctrlKey && !e.metaKey) || e.altKey) {
                        setTimeout(function () { // "hold on" to the ctrl key for 200ms
                            ctrl = false;
                        }, 200);
                    }
                    clearTimeout(debounceButtonPaneStatus);
                    debounceButtonPaneStatus = setTimeout(function () {
                        t.updateButtonPaneStatus();
                    }, 50);
                })
                .on('focus blur', function (e) {
                    t.$c.trigger('tbw' + e.type);
                    if (e.type === 'blur') {
                        $('.' + prefix + 'active-button', t.$btnPane).removeClass(prefix + 'active-button ' + prefix + 'active');
                    }
                    if (t.o.autogrowOnEnter) {
                        if (t.autogrowOnEnterDontClose) {
                            return;
                        }
                        if (e.type === 'focus') {
                            t.autogrowOnEnterWasFocused = true;
                            t.autogrowEditorOnEnter();
                        }
                        else if (!t.o.autogrow) {
                            t.$ed.css({height: t.$ed.css('min-height')});
                            t.$c.trigger('tbwresize');
                        }
                    }
                })
                .on('cut', function () {
                    setTimeout(function () {
                        t.semanticCode(false, true);
                        t.$c.trigger('tbwchange');
                    }, 0);
                })
                .on('paste', function (e) {
                    if (t.o.removeformatPasted) {
                        e.preventDefault();

                        if (window.getSelection && window.getSelection().deleteFromDocument) {
                            window.getSelection().deleteFromDocument();
                        }

                        try {
                            // IE
                            var text = window.clipboardData.getData('Text');

                            try {
                                // <= IE10
                                t.doc.selection.createRange().pasteHTML(text);
                            } catch (c) {
                                // IE 11
                                t.doc.getSelection().getRangeAt(0).insertNode(t.doc.createTextNode(text));
                            }
                            t.$c.trigger('tbwchange', e);
                        } catch (d) {
                            // Not IE
                            t.execCmd('insertText', (e.originalEvent || e).clipboardData.getData('text/plain'));
                        }
                    }

                    // Call pasteHandlers
                    $.each(t.pasteHandlers, function (i, pasteHandler) {
                        pasteHandler(e);
                    });

                    setTimeout(function () {
                        t.semanticCode(false, true);
                        t.$c.trigger('tbwpaste', e);
                    }, 0);
                });

            t.$ta
                .on('keyup', function () {
                    t.$c.trigger('tbwchange');
                })
                .on('paste', function () {
                    setTimeout(function () {
                        t.$c.trigger('tbwchange');
                    }, 0);
                });

            t.$box.on('keydown', function (e) {
                if (e.which === 27 && $('.' + prefix + 'modal-box', t.$box).length === 1) {
                    t.closeModal();
                    return false;
                }
            });
        },

        //autogrow when entering logic
        autogrowEditorOnEnter: function () {
            var t = this;
            t.$ed.removeClass('autogrow-on-enter');
            var oldHeight = t.$ed[0].clientHeight;
            t.$ed.height('auto');
            var totalHeight = t.$ed[0].scrollHeight;
            t.$ed.addClass('autogrow-on-enter');
            if (oldHeight !== totalHeight) {
                t.$ed.height(oldHeight);
                setTimeout(function () {
                    t.$ed.css({height: totalHeight});
                    t.$c.trigger('tbwresize');
                }, 0);
            }
        },


        // Build button pane, use o.btns option
        buildBtnPane: function () {
            var t = this,
                prefix = t.o.prefix;

            var $btnPane = t.$btnPane = $('<div/>', {
                class: prefix + 'button-pane'
            });

            $.each(t.o.btns, function (i, btnGrp) {
                if (!$.isArray(btnGrp)) {
                    btnGrp = [btnGrp];
                }

                var $btnGroup = $('<div/>', {
                    class: prefix + 'button-group ' + ((btnGrp.indexOf('fullscreen') >= 0) ? prefix + 'right' : '')
                });
                $.each(btnGrp, function (i, btn) {
                    try { // Prevent buildBtn error
                        if (t.isSupportedBtn(btn)) { // It's a supported button
                            $btnGroup.append(t.buildBtn(btn));
                        }
                    } catch (c) {
                    }
                });

                if ($btnGroup.html().trim().length > 0) {
                    $btnPane.append($btnGroup);
                }
            });

            t.$box.prepend($btnPane);
        },


        // Build a button and his action
        buildBtn: function (btnName) { // btnName is name of the button
            var t = this,
                prefix = t.o.prefix,
                btn = t.btnsDef[btnName],
                isDropdown = btn.dropdown,
                hasIcon = btn.hasIcon != null ? btn.hasIcon : true,
                textDef = t.lang[btnName] || btnName,

                $btn = $('<button/>', {
                    type: 'button',
                    class: prefix + btnName + '-button ' + (btn.class || '') + (!hasIcon ? ' ' + prefix + 'textual-button' : ''),
                    html: t.hasSvg && hasIcon ?
                        '<svg><use xlink:href="' + t.svgPath + '#' + prefix + (btn.ico || btnName).replace(/([A-Z]+)/g, '-$1').toLowerCase() + '"/></svg>' :
                        t.hideButtonTexts ? '' : (btn.text || btn.title || t.lang[btnName] || btnName),
                    title: (btn.title || btn.text || textDef) + ((btn.key) ? ' (Ctrl + ' + btn.key + ')' : ''),
                    tabindex: -1,
                    mousedown: function () {
                        if (!isDropdown || $('.' + btnName + '-' + prefix + 'dropdown', t.$box).is(':hidden')) {
                            $('body', t.doc).trigger('mousedown');
                        }

                        if ((t.$btnPane.hasClass(prefix + 'disable') || t.$box.hasClass(prefix + 'disabled')) &&
                            !$(this).hasClass(prefix + 'active') &&
                            !$(this).hasClass(prefix + 'not-disable')) {
                            return false;
                        }

                        t.execCmd((isDropdown ? 'dropdown' : false) || btn.fn || btnName, btn.param || btnName, btn.forceCss);

                        return false;
                    }
                });

            if (isDropdown) {
                $btn.addClass(prefix + 'open-dropdown');
                var dropdownPrefix = prefix + 'dropdown',
                    dropdownOptions = { // the dropdown
                    class: dropdownPrefix + '-' + btnName + ' ' + dropdownPrefix + ' ' + prefix + 'fixed-top'
                };
                dropdownOptions['data-' + dropdownPrefix] = btnName;
                var $dropdown = $('<div/>', dropdownOptions);
                $.each(isDropdown, function (i, def) {
                    if (t.btnsDef[def] && t.isSupportedBtn(def)) {
                        $dropdown.append(t.buildSubBtn(def));
                    }
                });
                t.$box.append($dropdown.hide());
            } else if (btn.key) {
                t.keys[btn.key] = {
                    fn: btn.fn || btnName,
                    param: btn.param || btnName
                };
            }

            if (!isDropdown) {
                t.tagToButton[(btn.tag || btnName).toLowerCase()] = btnName;
            }

            return $btn;
        },
        // Build a button for dropdown menu
        // @param n : name of the subbutton
        buildSubBtn: function (btnName) {
            var t = this,
                prefix = t.o.prefix,
                btn = t.btnsDef[btnName],
                hasIcon = btn.hasIcon != null ? btn.hasIcon : true;

            if (btn.key) {
                t.keys[btn.key] = {
                    fn: btn.fn || btnName,
                    param: btn.param || btnName
                };
            }

            t.tagToButton[(btn.tag || btnName).toLowerCase()] = btnName;

            return $('<button/>', {
                type: 'button',
                class: prefix + btnName + '-dropdown-button' + (btn.ico ? ' ' + prefix + btn.ico + '-button' : ''),
                html: t.hasSvg && hasIcon ? '<svg><use xlink:href="' + t.svgPath + '#' + prefix + (btn.ico || btnName).replace(/([A-Z]+)/g, '-$1').toLowerCase() + '"/></svg>' + (btn.text || btn.title || t.lang[btnName] || btnName) : (btn.text || btn.title || t.lang[btnName] || btnName),
                title: ((btn.key) ? ' (Ctrl + ' + btn.key + ')' : null),
                style: btn.style || null,
                mousedown: function () {
                    $('body', t.doc).trigger('mousedown');

                    t.execCmd(btn.fn || btnName, btn.param || btnName, btn.forceCss);

                    return false;
                }
            });
        },
        // Check if button is supported
        isSupportedBtn: function (b) {
            try {
                return this.btnsDef[b].isSupported();
            } catch (c) {
            }
            return true;
        },

        // Build overlay for modal box
        buildOverlay: function () {
            var t = this;
            t.$overlay = $('<div/>', {
                class: t.o.prefix + 'overlay'
            }).appendTo(t.$box);
            return t.$overlay;
        },
        showOverlay: function () {
            var t = this;
            $(window).trigger('scroll');
            t.$overlay.fadeIn(200);
            t.$box.addClass(t.o.prefix + 'box-blur');
        },
        hideOverlay: function () {
            var t = this;
            t.$overlay.fadeOut(50);
            t.$box.removeClass(t.o.prefix + 'box-blur');
        },

        // Management of fixed button pane
        fixedBtnPaneEvents: function () {
            var t = this,
                fixedFullWidth = t.o.fixedFullWidth,
                $box = t.$box;

            if (!t.o.fixedBtnPane) {
                return;
            }

            t.isFixed = false;

            $(window)
                .on('scroll.' + t.eventNamespace + ' resize.' + t.eventNamespace, function () {
                    if (!$box) {
                        return;
                    }

                    t.syncCode();

                    var scrollTop = $(window).scrollTop(),
                        offset = $box.offset().top + 1,
                        bp = t.$btnPane,
                        oh = bp.outerHeight() - 2;

                    if ((scrollTop - offset > 0) && ((scrollTop - offset - t.height) < 0)) {
                        if (!t.isFixed) {
                            t.isFixed = true;
                            bp.css({
                                position: 'fixed',
                                top: 0,
                                left: fixedFullWidth ? '0' : 'auto',
                                zIndex: 7
                            });
                            $([t.$ta, t.$ed]).css({marginTop: bp.height()});
                        }
                        bp.css({
                            width: fixedFullWidth ? '100%' : (($box.width() - 1) + 'px')
                        });

                        $('.' + t.o.prefix + 'fixed-top', $box).css({
                            position: fixedFullWidth ? 'fixed' : 'absolute',
                            top: fixedFullWidth ? oh : oh + (scrollTop - offset) + 'px',
                            zIndex: 15
                        });
                    } else if (t.isFixed) {
                        t.isFixed = false;
                        bp.removeAttr('style');
                        $([t.$ta, t.$ed]).css({marginTop: 0});
                        $('.' + t.o.prefix + 'fixed-top', $box).css({
                            position: 'absolute',
                            top: oh
                        });
                    }
                });
        },

        // Disable editor
        setDisabled: function (disable) {
            var t = this,
                prefix = t.o.prefix;

            t.disabled = disable;

            if (disable) {
                t.$ta.attr('disabled', true);
            } else {
                t.$ta.removeAttr('disabled');
            }
            t.$box.toggleClass(prefix + 'disabled', disable);
            t.$ed.attr('contenteditable', !disable);
        },

        // Destroy the editor
        destroy: function () {
            var t = this,
                prefix = t.o.prefix;

            if (t.isTextarea) {
                t.$box.after(
                    t.$ta
                        .css({height: ''})
                        .val(t.html())
                        .removeClass(prefix + 'textarea')
                        .show()
                );
            } else {
                t.$box.after(
                    t.$ed
                        .css({height: ''})
                        .removeClass(prefix + 'editor')
                        .removeAttr('contenteditable')
                        .removeAttr('dir')
                        .html(t.html())
                        .show()
                );
            }

            t.$ed.off('dblclick', 'img');

            t.destroyPlugins();

            t.$box.remove();
            t.$c.removeData('trumbowyg');
            $('body').removeClass(prefix + 'body-fullscreen');
            t.$c.trigger('tbwclose');
            $(window).off('scroll.' + t.eventNamespace + ' resize.' + t.eventNamespace);
        },


        // Empty the editor
        empty: function () {
            this.$ta.val('');
            this.syncCode(true);
        },


        // Function call when click on viewHTML button
        toggle: function () {
            var t = this,
                prefix = t.o.prefix;

            if (t.o.autogrowOnEnter) {
                t.autogrowOnEnterDontClose = !t.$box.hasClass(prefix + 'editor-hidden');
            }

            t.semanticCode(false, true);

            setTimeout(function () {
                t.doc.activeElement.blur();
                t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                t.$btnPane.toggleClass(prefix + 'disable');
                $('.' + prefix + 'viewHTML-button', t.$btnPane).toggleClass(prefix + 'active');
                if (t.$box.hasClass(prefix + 'editor-visible')) {
                    t.$ta.attr('tabindex', -1);
                } else {
                    t.$ta.removeAttr('tabindex');
                }

                if (t.o.autogrowOnEnter && !t.autogrowOnEnterDontClose) {
                    t.autogrowEditorOnEnter();
                }
            }, 0);
        },

        // Open dropdown when click on a button which open that
        dropdown: function (name) {
            var t = this,
                d = t.doc,
                prefix = t.o.prefix,
                $dropdown = $('[data-' + prefix + 'dropdown=' + name + ']', t.$box),
                $btn = $('.' + prefix + name + '-button', t.$btnPane),
                show = $dropdown.is(':hidden');

            $('body', d).trigger('mousedown');

            if (show) {
                var o = $btn.offset().left;
                $btn.addClass(prefix + 'active');

                $dropdown.css({
                    position: 'absolute',
                    top: $btn.offset().top - t.$btnPane.offset().top + $btn.outerHeight(),
                    left: (t.o.fixedFullWidth && t.isFixed) ? o + 'px' : (o - t.$btnPane.offset().left) + 'px'
                }).show();

                $(window).trigger('scroll');

                $('body', d).on('mousedown.' + t.eventNamespace, function (e) {
                    if (!$dropdown.is(e.target)) {
                        $('.' + prefix + 'dropdown', d).hide();
                        $('.' + prefix + 'active', d).removeClass(prefix + 'active');
                        $('body', d).off('mousedown.' + t.eventNamespace);
                    }
                });
            }
        },


        // HTML Code management
        html: function (html) {
            var t = this;
            if (html != null) {
                t.$ta.val(html);
                t.syncCode(true);
                return t;
            }
            return t.$ta.val();
        },
        syncTextarea: function () {
            var t = this;
            t.$ta.val(t.$ed.text().trim().length > 0 || t.$ed.find('hr,img,embed,iframe,input').length > 0 ? t.$ed.html() : '');
        },
        syncCode: function (force) {
            var t = this;
            if (!force && t.$ed.is(':visible')) {
                t.syncTextarea();
            } else {
                // wrap the content in a div it's easier to get the innerhtml
                var html = $('<div>').html(t.$ta.val());
                //scrub the html before loading into the doc
                var safe = $('<div>').append(html);
                $(t.o.tagsToRemove.join(','), safe).remove();
                t.$ed.html(safe.contents().html());
            }

            if (t.o.autogrow) {
                t.height = t.$ed.height();
                if (t.height !== t.$ta.css('height')) {
                    t.$ta.css({height: t.height});
                    t.$c.trigger('tbwresize');
                }
            }
            if (t.o.autogrowOnEnter) {
                // t.autogrowEditorOnEnter();
                t.$ed.height('auto');
                var totalheight = t.autogrowOnEnterWasFocused ? t.$ed[0].scrollHeight : t.$ed.css('min-height');
                if (totalheight !== t.$ta.css('height')) {
                    t.$ed.css({height: totalheight});
                    t.$c.trigger('tbwresize');
                }
            }
        },

        // Analyse and update to semantic code
        // @param force : force to sync code from textarea
        // @param full  : wrap text nodes in <p>
        // @param keepRange  : leave selection range as it is
        semanticCode: function (force, full, keepRange) {
            var t = this;
            t.saveRange();
            t.syncCode(force);

            if (t.o.semantic) {
                t.semanticTag('b', 'strong');
                t.semanticTag('i', 'em');
                t.semanticTag('s', 'del');
                t.semanticTag('strike', 'del');

                if (full) {
                    var inlineElementsSelector = t.o.inlineElementsSelector,
                        blockElementsSelector = ':not(' + inlineElementsSelector + ')';

                    // Wrap text nodes in span for easier processing
                    t.$ed.contents().filter(function () {
                        return this.nodeType === 3 && this.nodeValue.trim().length > 0;
                    }).wrap('<span data-tbw/>');

                    // Wrap groups of inline elements in paragraphs (recursive)
                    var wrapInlinesInParagraphsFrom = function ($from) {
                        if ($from.length !== 0) {
                            var $finalParagraph = $from.nextUntil(blockElementsSelector).addBack().wrapAll('<p/>').parent(),
                                $nextElement = $finalParagraph.nextAll(inlineElementsSelector).first();
                            $finalParagraph.next('br').remove();
                            wrapInlinesInParagraphsFrom($nextElement);
                        }
                    };
                    wrapInlinesInParagraphsFrom(t.$ed.children(inlineElementsSelector).first());

                    t.semanticTag('div', 'p', true);

                    // Unwrap paragraphs content, containing nothing usefull
                    t.$ed.find('p').filter(function () {
                        // Don't remove currently being edited element
                        if (t.range && this === t.range.startContainer) {
                            return false;
                        }
                        return $(this).text().trim().length === 0 && $(this).children().not('br,span').length === 0;
                    }).contents().unwrap();

                    // Get rid of temporial span's
                    $('[data-tbw]', t.$ed).contents().unwrap();

                    // Remove empty <p>
                    t.$ed.find('p:empty').remove();
                }

                if (!keepRange) {
                    t.restoreRange();
                }

                t.syncTextarea();
            }
        },

        semanticTag: function (oldTag, newTag, copyAttributes) {
            $(oldTag, this.$ed).each(function () {
                var $oldTag = $(this);
                $oldTag.wrap('<' + newTag + '/>');
                if (copyAttributes) {
                    $.each($oldTag.prop('attributes'), function () {
                        $oldTag.parent().attr(this.name, this.value);
                    });
                }
                $oldTag.contents().unwrap();
            });
        },

        // Function call when user click on "Insert Link"
        createLink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode,
                url,
                title,
                target;

            while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                node = node.parentNode;
            }

            if (node && node.nodeName === 'A') {
                var $a = $(node);
                url = $a.attr('href');
                title = $a.attr('title');
                target = $a.attr('target');
                var range = t.doc.createRange();
                range.selectNode(node);
                documentSelection.removeAllRanges();
                documentSelection.addRange(range);
            }

            t.saveRange();

            t.openModalInsert(t.lang.createLink, {
                url: {
                    label: 'URL',
                    required: true,
                    value: url
                },
                title: {
                    label: t.lang.title,
                    value: title
                },
                text: {
                    label: t.lang.text,
                    value: new XMLSerializer().serializeToString(documentSelection.getRangeAt(0).cloneContents())
                },
                target: {
                    label: t.lang.target,
                    value: target
                }
            }, function (v) { // v is value
                var link = $(['<a href="', v.url, '">', v.text, '</a>'].join(''));
                if (v.title.length > 0) {
                    link.attr('title', v.title);
                }
                if (v.target.length > 0) {
                    link.attr('target', v.target);
                }
                t.range.deleteContents();
                t.range.insertNode(link[0]);
                t.syncCode();
                t.$c.trigger('tbwchange');
                return true;
            });
        },
        unlink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode;

            if (documentSelection.isCollapsed) {
                while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                    node = node.parentNode;
                }

                if (node && node.nodeName === 'A') {
                    var range = t.doc.createRange();
                    range.selectNode(node);
                    documentSelection.removeAllRanges();
                    documentSelection.addRange(range);
                }
            }
            t.execCmd('unlink', undefined, undefined, true);
        },
        insertImage: function () {
            var t = this;
            t.saveRange();

            var options = {
                url: {
                    label: 'URL',
                    required: true
                },
                alt: {
                    label: t.lang.description,
                    value: t.getRangeText()
                }
            };

            if (t.o.imageWidthModalEdit) {
                options.width = {};
            }

            t.openModalInsert(t.lang.insertImage, options, function (v) { // v are values
                t.execCmd('insertImage', v.url);
                var $img = $('img[src="' + v.url + '"]:not([alt])', t.$box);
                $img.attr('alt', v.alt);

                if (t.o.imageWidthModalEdit) {
                    $img.attr({
                        width: v.width
                    });
                }

                t.syncCode();
                t.$c.trigger('tbwchange');

                return true;
            });
        },
        fullscreen: function () {
            var t = this,
                prefix = t.o.prefix,
                fullscreenCssClass = prefix + 'fullscreen',
                isFullscreen;

            t.$box.toggleClass(fullscreenCssClass);
            isFullscreen = t.$box.hasClass(fullscreenCssClass);
            $('body').toggleClass(prefix + 'body-fullscreen', isFullscreen);
            $(window).trigger('scroll');
            t.$c.trigger('tbw' + (isFullscreen ? 'open' : 'close') + 'fullscreen');
        },


        /*
         * Call method of trumbowyg if exist
         * else try to call anonymous function
         * and finaly native execCommand
         */
        execCmd: function (cmd, param, forceCss, skipTrumbowyg) {
            var t = this;
            skipTrumbowyg = !!skipTrumbowyg || '';

            if (cmd !== 'dropdown') {
                t.$ed.focus();
            }

            try {
                t.doc.execCommand('styleWithCSS', false, forceCss || false);
            } catch (c) {
            }

            try {
                t[cmd + skipTrumbowyg](param);
            } catch (c) {
                try {
                    cmd(param);
                } catch (e2) {
                    if (cmd === 'insertHorizontalRule') {
                        param = undefined;
                    } else if (cmd === 'formatBlock' && t.isIE) {
                        param = '<' + param + '>';
                    }

                    t.doc.execCommand(cmd, false, param);

                    t.syncCode();
                    t.semanticCode(false, true);
                }

                if (cmd !== 'dropdown') {
                    t.updateButtonPaneStatus();
                    t.$c.trigger('tbwchange');
                }
            }
        },


        // Open a modal box
        openModal: function (title, content) {
            var t = this,
                prefix = t.o.prefix;

            // No open a modal box when exist other modal box
            if ($('.' + prefix + 'modal-box', t.$box).length > 0) {
                return false;
            }
            if (t.o.autogrowOnEnter) {
                t.autogrowOnEnterDontClose = true;
            }

            t.saveRange();
            t.showOverlay();

            // Disable all btnPane btns
            t.$btnPane.addClass(prefix + 'disable');

            // Build out of ModalBox, it's the mask for animations
            var $modal = $('<div/>', {
                class: prefix + 'modal ' + prefix + 'fixed-top'
            }).css({
                top: t.$btnPane.height()
            }).appendTo(t.$box);

            // Click on overlay close modal by cancelling them
            t.$overlay.one('click', function () {
                $modal.trigger(CANCEL_EVENT);
                return false;
            });

            // Build the form
            var $form = $('<form/>', {
                action: '',
                html: content
            })
                .on('submit', function () {
                    $modal.trigger(CONFIRM_EVENT);
                    return false;
                })
                .on('reset', function () {
                    $modal.trigger(CANCEL_EVENT);
                    return false;
                })
                .on('submit reset', function () {
                    if (t.o.autogrowOnEnter) {
                        t.autogrowOnEnterDontClose = false;
                    }
                });


            // Build ModalBox and animate to show them
            var $box = $('<div/>', {
                class: prefix + 'modal-box',
                html: $form
            })
                .css({
                    top: '-' + t.$btnPane.outerHeight() + 'px',
                    opacity: 0
                })
                .appendTo($modal)
                .animate({
                    top: 0,
                    opacity: 1
                }, 100);


            // Append title
            $('<span/>', {
                text: title,
                class: prefix + 'modal-title'
            }).prependTo($box);

            $modal.height($box.outerHeight() + 10);


            // Focus in modal box
            $('input:first', $box).focus();


            // Append Confirm and Cancel buttons
            t.buildModalBtn('submit', $box);
            t.buildModalBtn('reset', $box);


            $(window).trigger('scroll');

            return $modal;
        },
        // @param n is name of modal
        buildModalBtn: function (n, $modal) {
            var t = this,
                prefix = t.o.prefix;

            return $('<button/>', {
                class: prefix + 'modal-button ' + prefix + 'modal-' + n,
                type: n,
                text: t.lang[n] || n
            }).appendTo($('form', $modal));
        },
        // close current modal box
        closeModal: function () {
            var t = this,
                prefix = t.o.prefix;

            t.$btnPane.removeClass(prefix + 'disable');
            t.$overlay.off();

            // Find the modal box
            var $modalBox = $('.' + prefix + 'modal-box', t.$box);

            $modalBox.animate({
                top: '-' + $modalBox.height()
            }, 100, function () {
                $modalBox.parent().remove();
                t.hideOverlay();
            });

            t.restoreRange();
        },
        // Preformated build and management modal
        openModalInsert: function (title, fields, cmd) {
            var t = this,
                prefix = t.o.prefix,
                lg = t.lang,
                html = '';

            $.each(fields, function (fieldName, field) {
                var l = field.label,
                    n = field.name || fieldName,
                    a = field.attributes || {};

                var attr = Object.keys(a).map(function (prop) {
                    return prop + '="' + a[prop] + '"';
                }).join(' ');

                html += '<label><input type="' + (field.type || 'text') + '" name="' + n + '" value="' + (field.value || '').replace(/"/g, '&quot;') + '"' + attr + '><span class="' + prefix + 'input-infos"><span>' +
                    ((!l) ? (lg[fieldName] ? lg[fieldName] : fieldName) : (lg[l] ? lg[l] : l)) +
                    '</span></span></label>';
            });

            return t.openModal(title, html)
                .on(CONFIRM_EVENT, function () {
                    var $form = $('form', $(this)),
                        valid = true,
                        values = {};

                    $.each(fields, function (fieldName, field) {
                        var $field = $('input[name="' + fieldName + '"]', $form),
                            inputType = $field.attr('type');

                        if (inputType.toLowerCase() === 'checkbox') {
                            values[fieldName] = $field.is(':checked');
                        } else {
                            values[fieldName] = $.trim($field.val());
                        }
                        // Validate value
                        if (field.required && values[fieldName] === '') {
                            valid = false;
                            t.addErrorOnModalField($field, t.lang.required);
                        } else if (field.pattern && !field.pattern.test(values[fieldName])) {
                            valid = false;
                            t.addErrorOnModalField($field, field.patternError);
                        }
                    });

                    if (valid) {
                        t.restoreRange();

                        if (cmd(values, fields)) {
                            t.syncCode();
                            t.$c.trigger('tbwchange');
                            t.closeModal();
                            $(this).off(CONFIRM_EVENT);
                        }
                    }
                })
                .one(CANCEL_EVENT, function () {
                    $(this).off(CONFIRM_EVENT);
                    t.closeModal();
                });
        },
        addErrorOnModalField: function ($field, err) {
            var prefix = this.o.prefix,
                $label = $field.parent();

            $field
                .on('change keyup', function () {
                    $label.removeClass(prefix + 'input-error');
                });

            $label
                .addClass(prefix + 'input-error')
                .find('input+span')
                .append(
                    $('<span/>', {
                        class: prefix + 'msg-error',
                        text: err
                    })
                );
        },

        getDefaultImgDblClickHandler: function () {
            var t = this;

            return function () {
                var $img = $(this),
                    src = $img.attr('src'),
                    base64 = '(Base64)';

                if (src.indexOf('data:image') === 0) {
                    src = base64;
                }

                var options = {
                    url: {
                        label: 'URL',
                        value: src,
                        required: true
                    },
                    alt: {
                        label: t.lang.description,
                        value: $img.attr('alt')
                    }
                };

                if (t.o.imageWidthModalEdit) {
                    options.width = {
                        value: $img.attr('width') ? $img.attr('width') : ''
                    };
                }

                t.openModalInsert(t.lang.insertImage, options, function (v) {
                    if (v.src !== base64) {
                        $img.attr({
                            src: v.src
                        });
                    }
                    $img.attr({
                        alt: v.alt
                    });

                    if (t.o.imageWidthModalEdit) {
                        if (parseInt(v.width) > 0) {
                            $img.attr({
                                width: v.width
                            });
                        } else {
                            $img.removeAttr('width');
                        }
                    }

                    return true;
                });
                return false;
            };
        },

        // Range management
        saveRange: function () {
            var t = this,
                documentSelection = t.doc.getSelection();

            t.range = null;

            if (documentSelection.rangeCount) {
                var savedRange = t.range = documentSelection.getRangeAt(0),
                    range = t.doc.createRange(),
                    rangeStart;
                range.selectNodeContents(t.$ed[0]);
                range.setEnd(savedRange.startContainer, savedRange.startOffset);
                rangeStart = (range + '').length;
                t.metaRange = {
                    start: rangeStart,
                    end: rangeStart + (savedRange + '').length
                };
            }
        },
        restoreRange: function () {
            var t = this,
                metaRange = t.metaRange,
                savedRange = t.range,
                documentSelection = t.doc.getSelection(),
                range;

            if (!savedRange) {
                return;
            }

            if (metaRange && metaRange.start !== metaRange.end) { // Algorithm from http://jsfiddle.net/WeWy7/3/
                var charIndex = 0,
                    nodeStack = [t.$ed[0]],
                    node,
                    foundStart = false,
                    stop = false;

                range = t.doc.createRange();

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType === 3) {
                        var nextCharIndex = charIndex + node.length;
                        if (!foundStart && metaRange.start >= charIndex && metaRange.start <= nextCharIndex) {
                            range.setStart(node, metaRange.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && metaRange.end >= charIndex && metaRange.end <= nextCharIndex) {
                            range.setEnd(node, metaRange.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        var cn = node.childNodes,
                            i = cn.length;

                        while (i > 0) {
                            i -= 1;
                            nodeStack.push(cn[i]);
                        }
                    }
                }
            }

            documentSelection.removeAllRanges();
            documentSelection.addRange(range || savedRange);
        },
        getRangeText: function () {
            return this.range + '';
        },

        updateButtonPaneStatus: function () {
            var t = this,
                prefix = t.o.prefix,
                tags = t.getTagsRecursive(t.doc.getSelection().focusNode),
                activeClasses = prefix + 'active-button ' + prefix + 'active';

            $('.' + prefix + 'active-button', t.$btnPane).removeClass(activeClasses);
            $.each(tags, function (i, tag) {
                var btnName = t.tagToButton[tag.toLowerCase()],
                    $btn = $('.' + prefix + btnName + '-button', t.$btnPane);

                if ($btn.length > 0) {
                    $btn.addClass(activeClasses);
                } else {
                    try {
                        $btn = $('.' + prefix + 'dropdown .' + prefix + btnName + '-dropdown-button', t.$box);
                        var dropdownBtnName = $btn.parent().data('dropdown');
                        $('.' + prefix + dropdownBtnName + '-button', t.$box).addClass(activeClasses);
                    } catch (e) {
                    }
                }
            });
        },
        getTagsRecursive: function (element, tags) {
            var t = this;
            tags = tags || (element && element.tagName ? [element.tagName] : []);

            if (element && element.parentNode) {
                element = element.parentNode;
            } else {
                return tags;
            }

            var tag = element.tagName;
            if (tag === 'DIV') {
                return tags;
            }
            if (tag === 'P' && element.style.textAlign !== '') {
                tags.push(element.style.textAlign);
            }

            $.each(t.tagHandlers, function (i, tagHandler) {
                tags = tags.concat(tagHandler(element, t));
            });

            tags.push(tag);

            return t.getTagsRecursive(element, tags).filter(function(tag) { return tag != null; });
        },

        // Plugins
        initPlugins: function () {
            var t = this;
            t.loadedPlugins = [];
            $.each($.trumbowyg.plugins, function (name, plugin) {
                if (!plugin.shouldInit || plugin.shouldInit(t)) {
                    plugin.init(t);
                    if (plugin.tagHandler) {
                        t.tagHandlers.push(plugin.tagHandler);
                    }
                    t.loadedPlugins.push(plugin);
                }
            });
        },
        destroyPlugins: function () {
            $.each(this.loadedPlugins, function (i, plugin) {
                if (plugin.destroy) {
                    plugin.destroy();
                }
            });
        }
    };
})(navigator, window, document, jQuery);


/***/ }),

/***/ 699:
/***/ (function(module, exports) {

module.exports = "/fonts/vendor/trumbowyg/dist/ui/icons.svg?429ed01d81a098d1088ded2d187cce5e";

/***/ }),

/***/ 700:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(701);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(636)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./trumbowyg.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./trumbowyg.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 701:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "/**\n * Trumbowyg v2.9.2 - A lightweight WYSIWYG editor\n * Default stylesheet for Trumbowyg editor\n * ------------------------\n * @link http://alex-d.github.io/Trumbowyg\n * @license MIT\n * @author Alexandre Demode (Alex-D)\n *         Twitter : @AlexandreDemode\n *         Website : alex-d.fr\n */\n\n#trumbowyg-icons {\n  overflow: hidden;\n  visibility: hidden;\n  height: 0;\n  width: 0; }\n  #trumbowyg-icons svg {\n    height: 0;\n    width: 0; }\n\n.trumbowyg-box *,\n.trumbowyg-box *::before,\n.trumbowyg-box *::after {\n  box-sizing: border-box; }\n\n.trumbowyg-box svg {\n  width: 17px;\n  height: 100%;\n  fill: #222; }\n\n.trumbowyg-box,\n.trumbowyg-editor {\n  display: block;\n  position: relative;\n  border: 1px solid #DDD;\n  width: 100%;\n  min-height: 300px;\n  margin: 17px auto; }\n\n.trumbowyg-box .trumbowyg-editor {\n  margin: 0 auto; }\n\n.trumbowyg-box.trumbowyg-fullscreen {\n  background: #FEFEFE;\n  border: none !important; }\n\n.trumbowyg-editor,\n.trumbowyg-textarea {\n  position: relative;\n  box-sizing: border-box;\n  padding: 20px;\n  min-height: 300px;\n  width: 100%;\n  border-style: none;\n  resize: none;\n  outline: none;\n  overflow: auto; }\n  .trumbowyg-editor.trumbowyg-autogrow-on-enter,\n  .trumbowyg-textarea.trumbowyg-autogrow-on-enter {\n    transition: height 300ms ease-out; }\n\n.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-box-blur .trumbowyg-editor::before {\n  color: transparent !important;\n  text-shadow: 0 0 7px #333; }\n  @media screen and (min-width: 0 \\0) {\n    .trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-box-blur .trumbowyg-editor::before {\n      color: rgba(200, 200, 200, 0.6) !important; } }\n  @supports (-ms-accelerator: true) {\n    .trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-box-blur .trumbowyg-editor::before {\n      color: rgba(200, 200, 200, 0.6) !important; } }\n\n.trumbowyg-box-blur .trumbowyg-editor img,\n.trumbowyg-box-blur .trumbowyg-editor hr {\n  opacity: 0.2; }\n\n.trumbowyg-textarea {\n  position: relative;\n  display: block;\n  overflow: auto;\n  border: none;\n  font-size: 14px;\n  font-family: \"Inconsolata\", \"Consolas\", \"Courier\", \"Courier New\", sans-serif;\n  line-height: 18px; }\n\n.trumbowyg-box.trumbowyg-editor-visible .trumbowyg-textarea {\n  height: 1px !important;\n  width: 25%;\n  min-height: 0 !important;\n  padding: 0 !important;\n  background: none;\n  opacity: 0 !important; }\n\n.trumbowyg-box.trumbowyg-editor-hidden .trumbowyg-textarea {\n  display: block; }\n\n.trumbowyg-box.trumbowyg-editor-hidden .trumbowyg-editor {\n  display: none; }\n\n.trumbowyg-box.trumbowyg-disabled .trumbowyg-textarea {\n  opacity: 0.8;\n  background: none; }\n\n.trumbowyg-editor[contenteditable=true]:empty:not(:focus)::before {\n  content: attr(placeholder);\n  color: #999;\n  pointer-events: none; }\n\n.trumbowyg-button-pane {\n  width: 100%;\n  min-height: 36px;\n  background: #ecf0f1;\n  border-bottom: 1px solid #d7e0e2;\n  margin: 0;\n  padding: 0 5px;\n  position: relative;\n  list-style-type: none;\n  line-height: 10px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  z-index: 11; }\n  .trumbowyg-button-pane::after {\n    content: \" \";\n    display: block;\n    position: absolute;\n    top: 36px;\n    left: 0;\n    right: 0;\n    width: 100%;\n    height: 1px;\n    background: #d7e0e2; }\n  .trumbowyg-button-pane .trumbowyg-button-group {\n    display: inline-block; }\n    .trumbowyg-button-pane .trumbowyg-button-group .trumbowyg-fullscreen-button svg {\n      color: transparent; }\n    .trumbowyg-button-pane .trumbowyg-button-group + .trumbowyg-button-group::before {\n      content: \" \";\n      display: inline-block;\n      width: 1px;\n      background: #d7e0e2;\n      margin: 0 5px;\n      height: 35px;\n      vertical-align: top; }\n  .trumbowyg-button-pane button {\n    display: inline-block;\n    position: relative;\n    width: 35px;\n    height: 35px;\n    padding: 1px 6px !important;\n    margin-bottom: 1px;\n    overflow: hidden;\n    border: none;\n    cursor: pointer;\n    background: none;\n    vertical-align: middle;\n    transition: background-color 150ms, opacity 150ms; }\n    .trumbowyg-button-pane button.trumbowyg-textual-button {\n      width: auto;\n      line-height: 35px;\n      -webkit-user-select: none;\n         -moz-user-select: none;\n          -ms-user-select: none;\n              user-select: none; }\n  .trumbowyg-button-pane.trumbowyg-disable button:not(.trumbowyg-not-disable):not(.trumbowyg-active),\n  .trumbowyg-disabled .trumbowyg-button-pane button:not(.trumbowyg-not-disable):not(.trumbowyg-viewHTML-button) {\n    opacity: 0.2;\n    cursor: default; }\n  .trumbowyg-button-pane.trumbowyg-disable .trumbowyg-button-group::before,\n  .trumbowyg-disabled .trumbowyg-button-pane .trumbowyg-button-group::before {\n    background: #e3e9eb; }\n  .trumbowyg-button-pane button:not(.trumbowyg-disable):hover,\n  .trumbowyg-button-pane button:not(.trumbowyg-disable):focus,\n  .trumbowyg-button-pane button.trumbowyg-active {\n    background-color: #FFF;\n    outline: none; }\n  .trumbowyg-button-pane .trumbowyg-open-dropdown::after {\n    display: block;\n    content: \" \";\n    position: absolute;\n    top: 25px;\n    right: 3px;\n    height: 0;\n    width: 0;\n    border: 3px solid transparent;\n    border-top-color: #555; }\n  .trumbowyg-button-pane .trumbowyg-open-dropdown.trumbowyg-textual-button {\n    padding-left: 10px !important;\n    padding-right: 18px !important; }\n    .trumbowyg-button-pane .trumbowyg-open-dropdown.trumbowyg-textual-button::after {\n      top: 17px;\n      right: 7px; }\n  .trumbowyg-button-pane .trumbowyg-right {\n    float: right; }\n    .trumbowyg-button-pane .trumbowyg-right::before {\n      display: none !important; }\n\n.trumbowyg-dropdown {\n  width: 200px;\n  border: 1px solid #ecf0f1;\n  padding: 5px 0;\n  border-top: none;\n  background: #FFF;\n  margin-left: -1px;\n  box-shadow: rgba(0, 0, 0, 0.1) 0 2px 3px;\n  z-index: 12; }\n  .trumbowyg-dropdown button {\n    display: block;\n    width: 100%;\n    height: 35px;\n    line-height: 35px;\n    text-decoration: none;\n    background: #FFF;\n    padding: 0 10px;\n    color: #333 !important;\n    border: none;\n    cursor: pointer;\n    text-align: left;\n    font-size: 15px;\n    transition: all 150ms; }\n    .trumbowyg-dropdown button:hover, .trumbowyg-dropdown button:focus {\n      background: #ecf0f1; }\n    .trumbowyg-dropdown button svg {\n      float: left;\n      margin-right: 14px; }\n\n/* Modal box */\n.trumbowyg-modal {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  max-width: 520px;\n  width: 100%;\n  height: 350px;\n  z-index: 11;\n  overflow: hidden;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.trumbowyg-modal-box {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  max-width: 500px;\n  width: calc(100% - 20px);\n  padding-bottom: 45px;\n  z-index: 1;\n  background-color: #FFF;\n  text-align: center;\n  font-size: 14px;\n  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 3px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n  .trumbowyg-modal-box .trumbowyg-modal-title {\n    font-size: 24px;\n    font-weight: bold;\n    margin: 0 0 20px;\n    padding: 15px 0 13px;\n    display: block;\n    border-bottom: 1px solid #EEE;\n    color: #333;\n    background: #fbfcfc; }\n  .trumbowyg-modal-box .trumbowyg-progress {\n    width: 100%;\n    height: 3px;\n    position: absolute;\n    top: 58px; }\n    .trumbowyg-modal-box .trumbowyg-progress .trumbowyg-progress-bar {\n      background: #2BC06A;\n      width: 0;\n      height: 100%;\n      transition: width 150ms linear; }\n  .trumbowyg-modal-box label {\n    display: block;\n    position: relative;\n    margin: 15px 12px;\n    height: 29px;\n    line-height: 29px;\n    overflow: hidden; }\n    .trumbowyg-modal-box label .trumbowyg-input-infos {\n      display: block;\n      text-align: left;\n      height: 25px;\n      line-height: 25px;\n      transition: all 150ms; }\n      .trumbowyg-modal-box label .trumbowyg-input-infos span {\n        display: block;\n        color: #69878f;\n        background-color: #fbfcfc;\n        border: 1px solid #DEDEDE;\n        padding: 0 7px;\n        width: 150px; }\n      .trumbowyg-modal-box label .trumbowyg-input-infos span.trumbowyg-msg-error {\n        color: #e74c3c; }\n    .trumbowyg-modal-box label.trumbowyg-input-error input,\n    .trumbowyg-modal-box label.trumbowyg-input-error textarea {\n      border: 1px solid #e74c3c; }\n    .trumbowyg-modal-box label.trumbowyg-input-error .trumbowyg-input-infos {\n      margin-top: -27px; }\n    .trumbowyg-modal-box label input {\n      position: absolute;\n      top: 0;\n      right: 0;\n      height: 27px;\n      line-height: 27px;\n      border: 1px solid #DEDEDE;\n      background: #fff;\n      font-size: 14px;\n      max-width: 330px;\n      width: 70%;\n      padding: 0 7px;\n      transition: all 150ms; }\n      .trumbowyg-modal-box label input:hover, .trumbowyg-modal-box label input:focus {\n        outline: none;\n        border: 1px solid #95a5a6; }\n      .trumbowyg-modal-box label input:focus {\n        background: #fbfcfc; }\n  .trumbowyg-modal-box .error {\n    margin-top: 25px;\n    display: block;\n    color: red; }\n  .trumbowyg-modal-box .trumbowyg-modal-button {\n    position: absolute;\n    bottom: 10px;\n    right: 0;\n    text-decoration: none;\n    color: #FFF;\n    display: block;\n    width: 100px;\n    height: 35px;\n    line-height: 33px;\n    margin: 0 10px;\n    background-color: #333;\n    border: none;\n    cursor: pointer;\n    font-family: \"Trebuchet MS\", Helvetica, Verdana, sans-serif;\n    font-size: 16px;\n    transition: all 150ms; }\n    .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit {\n      right: 110px;\n      background: #2bc06a; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:hover, .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:focus {\n        background: #40d47e;\n        outline: none; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:active {\n        background: #25a25a; }\n    .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset {\n      color: #555;\n      background: #e6e6e6; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:hover, .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:focus {\n        background: #fbfbfb;\n        outline: none; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:active {\n        background: #d5d5d5; }\n\n.trumbowyg-overlay {\n  position: absolute;\n  background-color: rgba(255, 255, 255, 0.5);\n  height: 100%;\n  width: 100%;\n  left: 0;\n  display: none;\n  top: 0;\n  z-index: 10; }\n\n/**\n * Fullscreen\n */\nbody.trumbowyg-body-fullscreen {\n  overflow: hidden; }\n\n.trumbowyg-fullscreen {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  z-index: 99999; }\n  .trumbowyg-fullscreen.trumbowyg-box,\n  .trumbowyg-fullscreen .trumbowyg-editor {\n    border: none; }\n  .trumbowyg-fullscreen .trumbowyg-editor,\n  .trumbowyg-fullscreen .trumbowyg-textarea {\n    height: calc(100% - 37px) !important;\n    overflow: auto; }\n  .trumbowyg-fullscreen .trumbowyg-overlay {\n    height: 100% !important; }\n  .trumbowyg-fullscreen .trumbowyg-button-group .trumbowyg-fullscreen-button svg {\n    color: #222;\n    fill: transparent; }\n\n.trumbowyg-editor {\n  /*\n     * lset for resetCss option\n     */ }\n  .trumbowyg-editor object,\n  .trumbowyg-editor embed,\n  .trumbowyg-editor video,\n  .trumbowyg-editor img {\n    max-width: 100%; }\n  .trumbowyg-editor video,\n  .trumbowyg-editor img {\n    height: auto; }\n  .trumbowyg-editor img {\n    cursor: move; }\n  .trumbowyg-editor.trumbowyg-reset-css {\n    background: #FEFEFE !important;\n    font-family: \"Trebuchet MS\", Helvetica, Verdana, sans-serif !important;\n    font-size: 14px !important;\n    line-height: 1.45em !important;\n    color: #333; }\n    .trumbowyg-editor.trumbowyg-reset-css a {\n      color: #15c !important;\n      text-decoration: underline !important; }\n    .trumbowyg-editor.trumbowyg-reset-css div,\n    .trumbowyg-editor.trumbowyg-reset-css p,\n    .trumbowyg-editor.trumbowyg-reset-css ul,\n    .trumbowyg-editor.trumbowyg-reset-css ol,\n    .trumbowyg-editor.trumbowyg-reset-css blockquote {\n      box-shadow: none !important;\n      background: none !important;\n      margin: 0 !important;\n      margin-bottom: 15px !important;\n      line-height: 1.4em !important;\n      font-family: \"Trebuchet MS\", Helvetica, Verdana, sans-serif !important;\n      font-size: 14px !important;\n      border: none; }\n    .trumbowyg-editor.trumbowyg-reset-css iframe,\n    .trumbowyg-editor.trumbowyg-reset-css object,\n    .trumbowyg-editor.trumbowyg-reset-css hr {\n      margin-bottom: 15px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css blockquote {\n      margin-left: 32px !important;\n      font-style: italic !important;\n      color: #555; }\n    .trumbowyg-editor.trumbowyg-reset-css ul,\n    .trumbowyg-editor.trumbowyg-reset-css ol {\n      padding-left: 20px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css ul ul,\n    .trumbowyg-editor.trumbowyg-reset-css ol ol,\n    .trumbowyg-editor.trumbowyg-reset-css ul ol,\n    .trumbowyg-editor.trumbowyg-reset-css ol ul {\n      border: none;\n      margin: 2px !important;\n      padding: 0 !important;\n      padding-left: 24px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css hr {\n      display: block;\n      height: 1px;\n      border: none;\n      border-top: 1px solid #CCC; }\n    .trumbowyg-editor.trumbowyg-reset-css h1,\n    .trumbowyg-editor.trumbowyg-reset-css h2,\n    .trumbowyg-editor.trumbowyg-reset-css h3,\n    .trumbowyg-editor.trumbowyg-reset-css h4 {\n      color: #111;\n      background: none;\n      margin: 0 !important;\n      padding: 0 !important;\n      font-weight: bold; }\n    .trumbowyg-editor.trumbowyg-reset-css h1 {\n      font-size: 32px !important;\n      line-height: 38px !important;\n      margin-bottom: 20px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css h2 {\n      font-size: 26px !important;\n      line-height: 34px !important;\n      margin-bottom: 15px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css h3 {\n      font-size: 22px !important;\n      line-height: 28px !important;\n      margin-bottom: 7px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css h4 {\n      font-size: 16px !important;\n      line-height: 22px !important;\n      margin-bottom: 7px !important; }\n\n/*\n * Dark theme\n */\n.trumbowyg-dark .trumbowyg-textarea {\n  background: #111;\n  color: #ddd; }\n\n.trumbowyg-dark .trumbowyg-box {\n  border: 1px solid #343434; }\n  .trumbowyg-dark .trumbowyg-box.trumbowyg-fullscreen {\n    background: #111; }\n  .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor::before {\n    text-shadow: 0 0 7px #ccc; }\n    @media screen and (min-width: 0 \\0 ) {\n      .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor::before {\n        color: rgba(20, 20, 20, 0.6) !important; } }\n    @supports (-ms-accelerator: true) {\n      .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor::before {\n        color: rgba(20, 20, 20, 0.6) !important; } }\n  .trumbowyg-dark .trumbowyg-box svg {\n    fill: #ecf0f1;\n    color: #ecf0f1; }\n\n.trumbowyg-dark .trumbowyg-button-pane {\n  background-color: #222;\n  border-bottom-color: #343434; }\n  .trumbowyg-dark .trumbowyg-button-pane::after {\n    background: #343434; }\n  .trumbowyg-dark .trumbowyg-button-pane .trumbowyg-button-group:not(:empty)::before {\n    background-color: #343434; }\n  .trumbowyg-dark .trumbowyg-button-pane .trumbowyg-button-group:not(:empty) .trumbowyg-fullscreen-button svg {\n    color: transparent; }\n  .trumbowyg-dark .trumbowyg-button-pane.trumbowyg-disable .trumbowyg-button-group::before {\n    background-color: #2a2a2a; }\n  .trumbowyg-dark .trumbowyg-button-pane button:not(.trumbowyg-disable):hover,\n  .trumbowyg-dark .trumbowyg-button-pane button:not(.trumbowyg-disable):focus,\n  .trumbowyg-dark .trumbowyg-button-pane button.trumbowyg-active {\n    background-color: #333; }\n  .trumbowyg-dark .trumbowyg-button-pane .trumbowyg-open-dropdown::after {\n    border-top-color: #fff; }\n\n.trumbowyg-dark .trumbowyg-fullscreen .trumbowyg-button-group .trumbowyg-fullscreen-button svg {\n  color: #ecf0f1;\n  fill: transparent; }\n\n.trumbowyg-dark .trumbowyg-dropdown {\n  border-color: #222;\n  background: #333;\n  box-shadow: rgba(0, 0, 0, 0.3) 0 2px 3px; }\n  .trumbowyg-dark .trumbowyg-dropdown button {\n    background: #333;\n    color: #fff !important; }\n    .trumbowyg-dark .trumbowyg-dropdown button:hover, .trumbowyg-dark .trumbowyg-dropdown button:focus {\n      background: #222; }\n\n.trumbowyg-dark .trumbowyg-modal-box {\n  background-color: #222; }\n  .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-title {\n    border-bottom: 1px solid #555;\n    color: #fff;\n    background: #3c3c3c; }\n  .trumbowyg-dark .trumbowyg-modal-box label {\n    display: block;\n    position: relative;\n    margin: 15px 12px;\n    height: 27px;\n    line-height: 27px;\n    overflow: hidden; }\n    .trumbowyg-dark .trumbowyg-modal-box label .trumbowyg-input-infos span {\n      color: #eee;\n      background-color: #2f2f2f;\n      border-color: #222; }\n    .trumbowyg-dark .trumbowyg-modal-box label .trumbowyg-input-infos span.trumbowyg-msg-error {\n      color: #e74c3c; }\n    .trumbowyg-dark .trumbowyg-modal-box label.trumbowyg-input-error input,\n    .trumbowyg-dark .trumbowyg-modal-box label.trumbowyg-input-error textarea {\n      border-color: #e74c3c; }\n    .trumbowyg-dark .trumbowyg-modal-box label input {\n      border-color: #222;\n      color: #eee;\n      background: #333; }\n      .trumbowyg-dark .trumbowyg-modal-box label input:hover, .trumbowyg-dark .trumbowyg-modal-box label input:focus {\n        border-color: #626262; }\n      .trumbowyg-dark .trumbowyg-modal-box label input:focus {\n        background-color: #2f2f2f; }\n  .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit {\n    background: #1b7943; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:hover, .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:focus {\n      background: #25a25a; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:active {\n      background: #176437; }\n  .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset {\n    background: #333;\n    color: #ccc; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:hover, .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:focus {\n      background: #444; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:active {\n      background: #111; }\n\n.trumbowyg-dark .trumbowyg-overlay {\n  background-color: rgba(15, 15, 15, 0.6); }\n", ""]);

// exports


/***/ }),

/***/ 702:
/***/ (function(module, exports) {

!function(e){"use strict";var r={proxy:"https://noembed.com/embed?nowrap=on",urlFiled:"url",data:[],success:void 0,error:void 0};e.extend(!0,e.trumbowyg,{langs:{en:{noembed:"Noembed",noembedError:"Error"},sk:{noembedError:"Chyba"},fr:{noembedError:"Erreur"},cs:{noembedError:"Chyba"},ru:{noembedError:"Ошибка"},ja:{noembedError:"エラー"}},plugins:{noembed:{init:function(o){o.o.plugins.noembed=e.extend(!0,{},r,o.o.plugins.noembed||{});var n={fn:function(){var r=o.openModalInsert(o.lang.noembed,{url:{label:"URL",required:!0}},function(n){e.ajax({url:o.o.plugins.noembed.proxy,type:"GET",data:n,cache:!1,dataType:"json",success:o.o.plugins.noembed.success||function(n){n.html?(o.execCmd("insertHTML",n.html),setTimeout(function(){o.closeModal()},250)):o.addErrorOnModalField(e("input[type=text]",r),n.error)},error:o.o.plugins.noembed.error||function(){o.addErrorOnModalField(e("input[type=text]",r),o.lang.noembedError)}})})}};o.addBtnDef("noembed",n)}}}})}(jQuery);

/***/ }),

/***/ 703:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("trumbowyg", {
    attrs: { config: _vm.config.advanced, id: _vm.id },
    model: {
      value: _vm.content,
      callback: function($$v) {
        _vm.content = $$v
      },
      expression: "content"
    }
  })
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4b3f9ab1", module.exports)
  }
}

/***/ }),

/***/ 704:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(705);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("2e66acb8", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0cdd7a0a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./UploadButton.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0cdd7a0a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./UploadButton.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 705:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n.jbtn-file[data-v-0cdd7a0a] {\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n  bottom: -15px;\n}\n.jbtn-file input[type=file][data-v-0cdd7a0a] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  font-size: 100px;\n  text-align: right;\n  filter: alpha(opacity=0);\n  opacity: 0;\n  outline: none;\n  cursor: inherit;\n  display: block;\n}\n", ""]);

// exports


/***/ }),

/***/ 706:
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        selectedCallback: {
            type: Function,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    methods: {
        fileSelected: function fileSelected(e) {
            if (this.selectedCallback) {
                if (e.target.files[0]) {
                    this.selectedCallback(e.target.files[0]);
                } else {
                    this.selectedCallback(null);
                }
            }
        }
    }
});

/***/ }),

/***/ 707:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-btn",
    {
      staticClass: "jbtn-file",
      attrs: { flat: "", icon: "", color: "cyan", dark: "" }
    },
    [
      _c("v-icon", [_vm._v("fa-upload")]),
      _vm._v(" "),
      _c("input", {
        attrs: { id: "selectFile", type: "file" },
        on: { change: _vm.fileSelected }
      })
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
    require("vue-hot-reload-api")      .rerender("data-v-0cdd7a0a", module.exports)
  }
}

/***/ }),

/***/ 942:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue__ = __webpack_require__(677);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_theme__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_acl__ = __webpack_require__(688);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_traffic_ActionPanel_vue__ = __webpack_require__(943);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_traffic_ActionPanel_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_traffic_ActionPanel_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_traffic_TrafficPerformance_vue__ = __webpack_require__(946);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_traffic_TrafficPerformance_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_traffic_TrafficPerformance_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_traffic_CreateCampaign_vue__ = __webpack_require__(976);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_traffic_CreateCampaign_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_traffic_CreateCampaign_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        MainLayout: __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue___default.a,
        ActionPanel: __WEBPACK_IMPORTED_MODULE_3__components_traffic_ActionPanel_vue___default.a,
        TrafficPerformance: __WEBPACK_IMPORTED_MODULE_4__components_traffic_TrafficPerformance_vue___default.a,
        CreateCampaign: __WEBPACK_IMPORTED_MODULE_5__components_traffic_CreateCampaign_vue___default.a

    },
    mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins_theme__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__mixins_acl__["a" /* default */]],
    data: function data() {
        return {
            contentClass: { 'grey': true, 'lighten-4': true, 'accent--text': true },
            lifetime: 0,
            monthly: 0,
            socialCount: 0,
            /* tabs */
            tabs: [{ name: 'traffic performance', component: 'traffic-performance', icon: 'trending_up', iconColor: 'primary' }],
            active: {
                name: 'traffic performance'
            }

        };
    },
    methods: {
        AddCampaign: function AddCampaign() {
            Bus.$emit('open-create-campaign-modal');
        }
    }
});

/***/ }),

/***/ 943:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(944)
/* template */
var __vue_template__ = __webpack_require__(945)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\ActionPanel.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-49a237e8", Component.options)
  } else {
    hotAPI.reload("data-v-49a237e8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 944:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        lifetime: {
            type: Number,
            required: true
        },
        monthly: {
            type: Number,
            required: true
        },
        projectCount: {
            type: Number,
            required: true
        }
    },

    data: function data() {
        return {
            totalproject: 0,
            monthTotal: 0,
            totalAccounts: 0
        };
    },
    mounted: function mounted() {
        this.lifetimeTotal = this.lifetime;
        this.monthTotal = this.monthly;
        this.totalproject = this.projectCount;
    }
});

/***/ }),

/***/ 945:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { attrs: { fluid: "", "pa-0": "", "ma-0": "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "", "align-center": "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md4: "", "text-xs-left": "" } },
            [
              _c(
                "v-card",
                {
                  staticClass: "ma-1",
                  attrs: { color: "accent", height: "110px" }
                },
                [
                  _c(
                    "v-card-text",
                    { staticClass: "title pa-5" },
                    [
                      _c("v-icon", { attrs: { large: "", color: "primary" } }, [
                        _vm._v("\n            date_range\n          ")
                      ]),
                      _vm._v(" "),
                      _c("span", { staticClass: "white--text" }, [
                        _vm._v("Action This Month: " + _vm._s(_vm.monthTotal))
                      ])
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
            "v-flex",
            { attrs: { xs12: "", md4: "", "text-xs-left": "" } },
            [
              _c(
                "v-card",
                {
                  staticClass: "ma-1",
                  attrs: { color: "accent", height: "110px" }
                },
                [
                  _c(
                    "v-card-text",
                    { staticClass: "title pa-5" },
                    [
                      _c("v-icon", { attrs: { large: "", color: "primary" } }, [
                        _vm._v("\n            schedule\n          ")
                      ]),
                      _vm._v(" "),
                      _c("span", { staticClass: "white--text" }, [
                        _vm._v("Action Live Time: " + _vm._s(_vm.lifetime))
                      ])
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
            "v-flex",
            { attrs: { xs12: "", md4: "", "text-xs-left": "" } },
            [
              _c(
                "v-card",
                {
                  staticClass: "ma-1",
                  attrs: { color: "accent", height: "110px" }
                },
                [
                  _c(
                    "v-card-text",
                    { staticClass: "title pa-5" },
                    [
                      _c("v-icon", { attrs: { large: "", color: "primary" } }, [
                        _vm._v("\n            fa-fa\n          ")
                      ]),
                      _vm._v(" "),
                      _c("span", { staticClass: "white--text" }, [
                        _vm._v("Total Project: " + _vm._s(_vm.totalproject))
                      ])
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
    require("vue-hot-reload-api")      .rerender("data-v-49a237e8", module.exports)
  }
}

/***/ }),

/***/ 946:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(947)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(949)
/* template */
var __vue_template__ = __webpack_require__(975)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\TrafficPerformance.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0bfae5e9", Component.options)
  } else {
    hotAPI.reload("data-v-0bfae5e9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 947:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(948);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("7c68a14d", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0bfae5e9\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./TrafficPerformance.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0bfae5e9\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./TrafficPerformance.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 948:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 949:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_traffic_CampaignLists_vue__ = __webpack_require__(950);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_traffic_CampaignLists_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_traffic_CampaignLists_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        CampaignLists: __WEBPACK_IMPORTED_MODULE_0__components_traffic_CampaignLists_vue___default.a
    },
    props: {
        tab: {
            type: Object,
            required: true
        }
    },
    data: function data() {
        return {
            api_key: 'XYZ',
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            /* table */
            headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Group Name', value: 'name', align: 'left', sortable: true }, { text: '# of Campaigns', value: 'no_of_campaigns', align: 'left', sortable: false }, { text: 'Daily Credit Spent', value: 'daily_credits_spent', align: 'left', sortable: true }, { text: 'Total Credit Spent', value: 'total_credits_spent', align: 'left', sortable: true }, { text: 'OKM', value: '"overall_keyword_movement', align: 'left', sortable: true }],
            items: [
            // category/campaign group ->  campaigns -> activities
            { id: 1, user_id: 1, name: 'Group # 1', 'no_of_campaigns': 1, daily_credits_spent: 1, total_credits_spent: 1, overall_keyword_movement: '0.1' }, { id: 2, user_id: 1, name: 'Group # 2', 'no_of_campaigns': 2, daily_credits_spent: 2, total_credits_spent: 2, overall_keyword_movement: '0.2' }, { id: 3, user_id: 1, name: 'Group # 3', 'no_of_campaigns': 3, daily_credits_spent: 3, total_credits_spent: 3, overall_keyword_movement: '0.3' }, { id: 4, user_id: 1, name: 'Group # 4', 'no_of_campaigns': 4, daily_credits_spent: 4, total_credits_spent: 4, overall_keyword_movement: '0.4' }]
        };
    },
    methods: {
        isActive: function isActive(item) {
            return !!item.active;
        },
        toggleAll: function toggleAll() {
            if (this.selected.length) this.selected = [];else this.selected = this.items.slice();
        },
        changeSort: function changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
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
        deleteItem: function deleteItem(item) {
            var self = this;
            var itemIndex = _.findIndex(self.items, ['id', item.id]);
            self.items.splice(itemIndex, 1);
            var selectedIndex = _.findIndex(self.selected, ['id', item.id]);
            self.selected.splice(selectedIndex, 1);
        }
    }
});

/***/ }),

/***/ 950:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(951)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(953)
/* template */
var __vue_template__ = __webpack_require__(974)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\CampaignLists.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6ebb42df", Component.options)
  } else {
    hotAPI.reload("data-v-6ebb42df", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 951:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(952);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("b2cadb5e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ebb42df\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CampaignLists.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ebb42df\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CampaignLists.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 952:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 953:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ActivityLists__ = __webpack_require__(954);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ActivityLists___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ActivityLists__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EditCampaign__ = __webpack_require__(959);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EditCampaign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__EditCampaign__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        ActivityLists: __WEBPACK_IMPORTED_MODULE_0__ActivityLists___default.a,
        EditCampaign: __WEBPACK_IMPORTED_MODULE_1__EditCampaign___default.a
    },
    data: function data() {
        return {
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            search: '',
            /* table */
            headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Campaign Name', value: 'name', align: 'left', sortable: true }, { text: 'Rank', value: 'status', align: 'left', sortable: true }, { text: 'Today Credit', value: 'daily_credit_spent', align: 'left', sortable: true }, { text: 'Smart Rank', value: 'smart_rank', align: 'center', sortable: true }, { text: 'Status', value: 'status', align: 'center', sortable: true }],
            items: [{
                //! Campaign
                id: 1,
                name: 'Test1',
                status: 'on',
                smart_rank: 'on',
                daily_credit_spent: 1,
                rank: 1
            }, {
                //! Campaign
                id: 1,
                name: 'Test2',
                status: 'off',
                smart_rank: 'off',
                daily_credit_spent: 2,
                rank: 2
            }]
        };
    },
    methods: {
        changeSort: function changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
        },
        toggleAll: function toggleAll() {
            if (this.selected.length) this.selected = [];else this.selected = this.items.slice();
        },
        deleteSelected: function deleteSelected() {
            var self = this;
            var newItems = _.difference(self.items, self.selected);
            self.items = newItems;
            self.selected = [];
            //! Send Api Call To Delete The Social Account
        },
        deleteItem: function deleteItem(item) {
            var self = this;
            var itemIndex = _.findIndex(self.items, ['id', item.id]);
            self.items.splice(itemIndex, 1);
            var selectedIndex = _.findIndex(self.selected, ['id', item.id]);
            self.selected.splice(selectedIndex, 1);
        },
        editItem: function editItem(item) {
            console.log('edit item', item);
            Bus.$emit('open-edit-campaign-modal');
        },
        viewActivities: function viewActivities(item) {
            console.log(item);
            Bus.$emit('open-activity-modal');
        }
    }
});

/***/ }),

/***/ 954:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(955)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(957)
/* template */
var __vue_template__ = __webpack_require__(958)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\ActivityLists.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-77ff1fc0", Component.options)
  } else {
    hotAPI.reload("data-v-77ff1fc0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 955:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(956);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("35353a86", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-77ff1fc0\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./ActivityLists.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-77ff1fc0\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./ActivityLists.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 956:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 957:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data: function data() {
        return {
            dialog: false,
            items: [{
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [{ name: 'Visited https://google.com', duration: '5 secs' }]
            }, {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [{ name: 'Visited https://google.com', duration: '15 secs' }, { name: 'Visited https://google.com', duration: '25 secs' }, { name: 'Visited https://google.com', duration: '35 secs' }]
            }, {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [{ name: 'Visited https://google.com', duration: '15 secs' }, { name: 'Visited https://google.com', duration: '25 secs' }, { name: 'Visited https://google.com', duration: '35 secs' }]
            }, {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [{ name: 'Visited https://google.com', duration: '15 secs' }, { name: 'Visited https://google.com', duration: '25 secs' }, { name: 'Visited https://google.com', duration: '35 secs' }]
            }, {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [{ name: 'Visited https://google.com', duration: '15 secs' }, { name: 'Visited https://google.com', duration: '25 secs' }, { name: 'Visited https://google.com', duration: '35 secs' }]
            }, {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [{ name: 'Visited https://google.com', duration: '15 secs' }, { name: 'Visited https://google.com', duration: '25 secs' }, { name: 'Visited https://google.com', duration: '35 secs' }]
            }, {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                items: [{ name: 'Visited https://google.com', duration: '15 secs' }, { name: 'Visited https://google.com', duration: '25 secs' }, { name: 'Visited https://google.com', duration: '35 secs' }]
            }]
        };
    },
    mounted: function mounted() {
        var self = this;
        Bus.$on('open-activity-modal', function () {
            self.dialog = true;
        });
    }
});

/***/ }),

/***/ 958:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: {
        fullscreen: "",
        transition: "dialog-bottom-transition",
        overlay: false
      },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _c(
        "v-card",
        [
          _c(
            "v-toolbar",
            {
              staticStyle: { "z-index": "1000" },
              attrs: { dark: "", color: "accent" }
            },
            [
              _c(
                "v-btn",
                {
                  attrs: { icon: "", dark: "" },
                  nativeOn: {
                    click: function($event) {
                      _vm.dialog = false
                    }
                  }
                },
                [
                  _c("v-icon", { attrs: { color: "primary" } }, [
                    _vm._v("close")
                  ])
                ],
                1
              ),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c("v-toolbar-title", [
                _c("span", { staticClass: "primary--text headline" }, [
                  _vm._v("Campaign Activities")
                ])
              ]),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c(
                "v-toolbar-items",
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { dark: "", flat: "", color: "primary" },
                      nativeOn: {
                        click: function($event) {
                          _vm.dialog = false
                        }
                      }
                    },
                    [_vm._v("\n          Close\n        ")]
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-container",
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-list",
                        _vm._l(_vm.items, function(item, itemIndex) {
                          return _c(
                            "v-list-group",
                            { key: itemIndex },
                            [
                              _c(
                                "v-list-tile",
                                {
                                  attrs: { slot: "item" },
                                  on: { click: function($event) {} },
                                  slot: "item"
                                },
                                [
                                  _c(
                                    "v-list-tile-action",
                                    [_c("v-icon", [_vm._v("fa-plus")])],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-list-tile-content",
                                    [
                                      _c("v-list-tile-title", [
                                        _vm._v(
                                          "\n                    " +
                                            _vm._s(item.name) +
                                            " - Total Duration: " +
                                            _vm._s(item.total_duration) +
                                            "\n                  "
                                        )
                                      ])
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-list-tile-action",
                                    [
                                      _c("v-icon", [
                                        _vm._v("keyboard_arrow_down")
                                      ])
                                    ],
                                    1
                                  )
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _vm._l(item.activities, function(
                                subItem,
                                subItemKey
                              ) {
                                return _c(
                                  "v-list-tile",
                                  {
                                    key: subItemKey,
                                    on: { click: function($event) {} }
                                  },
                                  [
                                    _c(
                                      "v-list-tile-content",
                                      [
                                        _c("v-list-tile-title", [
                                          _vm._v(_vm._s(subItem.name))
                                        ])
                                      ],
                                      1
                                    ),
                                    _vm._v(" "),
                                    _c("v-list-tile-action", [
                                      _vm._v(
                                        "\n                  " +
                                          _vm._s(subItem.duration) +
                                          "\n                "
                                      )
                                    ])
                                  ],
                                  1
                                )
                              })
                            ],
                            2
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
    require("vue-hot-reload-api")      .rerender("data-v-77ff1fc0", module.exports)
  }
}

/***/ }),

/***/ 959:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(960)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(962)
/* template */
var __vue_template__ = __webpack_require__(973)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\EditCampaign.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5816ac30", Component.options)
  } else {
    hotAPI.reload("data-v-5816ac30", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 960:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(961);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("cb28e0c8", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5816ac30\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./EditCampaign.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5816ac30\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./EditCampaign.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 961:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 962:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__traffic_CampaignDetails_vue__ = __webpack_require__(963);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__traffic_CampaignDetails_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__traffic_CampaignDetails_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__traffic_CampaignPerformance_vue__ = __webpack_require__(968);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__traffic_CampaignPerformance_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__traffic_CampaignPerformance_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        CampaignDetails: __WEBPACK_IMPORTED_MODULE_0__traffic_CampaignDetails_vue___default.a,
        CampaignPerformance: __WEBPACK_IMPORTED_MODULE_1__traffic_CampaignPerformance_vue___default.a
    },
    data: function data() {
        return {
            /* tabs */
            tabs: [{ name: 'edit campaign', component: 'campaign-details', icon: 'fa-edit', iconColor: 'accent' }, { name: 'campaign stats', component: 'campaign-performance', icon: 'timeline', iconColor: 'primary' }],
            active: {
                name: 'edit campaign'
            },
            dialog: false
        };
    },
    mounted: function mounted() {
        var self = this;
        Bus.$on('open-edit-campaign-modal', function () {
            self.dialog = true;
        });
    }
});

/***/ }),

/***/ 963:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(964)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(966)
/* template */
var __vue_template__ = __webpack_require__(967)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\CampaignDetails.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6bbcae8c", Component.options)
  } else {
    hotAPI.reload("data-v-6bbcae8c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 964:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(965);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("71898cd7", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6bbcae8c\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CampaignDetails.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6bbcae8c\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CampaignDetails.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 965:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 966:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data: function data() {
        return {
            // ? First Step
            name: '',
            url: '',
            keywords: [],
            keyword_list: [],
            group_name: '',
            group_list: ['test1', 'test2'],
            traffic_type: '', // either direct or search engine
            search_engine_type: '', // google or youtube
            search_engine: '', // link of search engine domain of google or youtube
            google_search_engine: ['https://google.com', 'https://google.com.ph'],
            youtube_search_engine: ['https://youtube.com'],
            // ? Second Step
            geo_tracking: false,
            country: '',
            country_list: ['Philippines', 'US', 'Australia'],
            state: '',
            state_list: ['State 1', 'State 2'],
            internal_browsing: true,
            random_browsing: true,
            sites: '',
            site_list: [],
            bounce_back: true,
            play_video_embeds: false,
            min_spent_to_watch: 1,
            social_sharing: false,
            retweets_per_month: 1,
            favourites_per_month: 1,
            facebook_likes_per_month: 1, // either 0 or greater than 20
            facebook_shares_per_month: 1, // either 0 or greater than 20
            search_boost_per_month: 50, // min 50
            minutes_spent_on_visit: 1
        };
    },
    computed: {
        approx_daily_credit_cost: function approx_daily_credit_cost() {
            return 1.67 * this.minutes_spent_on_visit;
        },
        approx_monthly_cost: function approx_monthly_cost() {
            return this.search_boost_per_month;
        }
    }
});

/***/ }),

/***/ 967:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    [
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-text-field", {
                attrs: {
                  name: "name",
                  label: "Campaign Name",
                  "single-line": "",
                  "prepend-icon": "fa-fa"
                },
                model: {
                  value: _vm.name,
                  callback: function($$v) {
                    _vm.name = $$v
                  },
                  expression: "name"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-select", {
                attrs: {
                  label: "Group Name",
                  "prepend-icon": "folder",
                  chips: "",
                  items: _vm.group_list
                },
                scopedSlots: _vm._u([
                  {
                    key: "selection",
                    fn: function(data) {
                      return [
                        _c(
                          "v-chip",
                          {
                            key: JSON.stringify(data.item),
                            staticClass: "chip--select-multi",
                            attrs: {
                              selected: data.selected,
                              disabled: data.disabled
                            },
                            on: {
                              input: function($event) {
                                data.parent.selectItem(data.item)
                              }
                            }
                          },
                          [
                            _c(
                              "v-avatar",
                              { staticClass: "accent white--text" },
                              [
                                _vm._v(
                                  "\n              " +
                                    _vm._s(
                                      data.item.slice(0, 1).toUpperCase()
                                    ) +
                                    "\n            "
                                )
                              ]
                            ),
                            _vm._v(" "),
                            _c("span", { staticClass: "primary--text" }, [
                              _vm._v(_vm._s(data.item))
                            ])
                          ],
                          1
                        )
                      ]
                    }
                  }
                ]),
                model: {
                  value: _vm.group_name,
                  callback: function($$v) {
                    _vm.group_name = $$v
                  },
                  expression: "group_name"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-flex",
        { attrs: { xs12: "", md8: "", "offset-md2": "" } },
        [
          _c("v-text-field", {
            attrs: {
              name: "url",
              label: "Url",
              "prepend-icon": "link",
              hint: "Enter your website URL starting with http:// or https://",
              "persistent-hint": "",
              "single-line": ""
            },
            model: {
              value: _vm.url,
              callback: function($$v) {
                _vm.url = $$v
              },
              expression: "url"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c(
                "v-radio-group",
                {
                  attrs: { mandatory: true, row: "" },
                  model: {
                    value: _vm.traffic_type,
                    callback: function($$v) {
                      _vm.traffic_type = $$v
                    },
                    expression: "traffic_type"
                  }
                },
                [
                  _c("v-radio", {
                    attrs: {
                      color: "primary",
                      label: "Via Search Engine",
                      value: "search_engine"
                    }
                  }),
                  _vm._v(" "),
                  _c("v-radio", {
                    attrs: {
                      color: "info",
                      label: "Via Direct Traffic",
                      value: "direct_traffic"
                    }
                  })
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
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-select", {
                attrs: {
                  label: "Keywords",
                  chips: "",
                  tags: "",
                  "prepend-icon": "fa-tags",
                  items: _vm.keyword_list
                },
                scopedSlots: _vm._u([
                  {
                    key: "selection",
                    fn: function(data) {
                      return [
                        _c(
                          "v-chip",
                          {
                            key: JSON.stringify(data.item),
                            staticClass: "chip--select-multi",
                            attrs: {
                              selected: data.selected,
                              disabled: data.disabled
                            },
                            on: {
                              input: function($event) {
                                data.parent.selectItem(data.item)
                              }
                            }
                          },
                          [
                            _c("v-avatar", { staticClass: "primary" }, [
                              _vm._v(
                                _vm._s(data.item.slice(0, 1).toUpperCase())
                              )
                            ]),
                            _vm._v(
                              "\n            " +
                                _vm._s(data.item) +
                                "\n          "
                            )
                          ],
                          1
                        )
                      ]
                    }
                  }
                ]),
                model: {
                  value: _vm.keywords,
                  callback: function($$v) {
                    _vm.keywords = $$v
                  },
                  expression: "keywords"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.traffic_type === "search_engine"
        ? _c(
            "v-layout",
            { attrs: { row: "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                [
                  _c(
                    "v-radio-group",
                    {
                      attrs: { mandatory: true, row: "" },
                      model: {
                        value: _vm.search_engine_type,
                        callback: function($$v) {
                          _vm.search_engine_type = $$v
                        },
                        expression: "search_engine_type"
                      }
                    },
                    [
                      _c("v-radio", {
                        attrs: {
                          color: "blue darken-2",
                          label: "Google Search Engine",
                          value: "google",
                          "prepend-icon": "fa-google"
                        }
                      }),
                      _vm._v(" "),
                      _c("v-radio", {
                        attrs: {
                          color: "red darken-4",
                          label: "Youtube Search Engine",
                          value: "youtube",
                          "prepend-icon": "fa-youtube"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.traffic_type === "search_engine"
        ? _c(
            "v-layout",
            { attrs: { row: "" } },
            [
              _vm.search_engine_type === "google"
                ? _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-select", {
                        attrs: {
                          label: "Google Search Engine",
                          chips: "",
                          "prepend-icon": "fa-tags",
                          items: _vm.google_search_engine
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "selection",
                            fn: function(data) {
                              return [
                                _c(
                                  "v-chip",
                                  {
                                    key: JSON.stringify(data.item),
                                    staticClass: "chip--select-multi",
                                    attrs: {
                                      selected: data.selected,
                                      disabled: data.disabled
                                    },
                                    on: {
                                      input: function($event) {
                                        data.parent.selectItem(data.item)
                                      }
                                    }
                                  },
                                  [
                                    _c("v-avatar", { staticClass: "primary" }, [
                                      _vm._v(
                                        _vm._s(
                                          data.item.slice(0, 1).toUpperCase()
                                        )
                                      )
                                    ]),
                                    _vm._v(
                                      "\n            " +
                                        _vm._s(data.item) +
                                        "\n          "
                                    )
                                  ],
                                  1
                                )
                              ]
                            }
                          }
                        ]),
                        model: {
                          value: _vm.search_engine,
                          callback: function($$v) {
                            _vm.search_engine = $$v
                          },
                          expression: "search_engine"
                        }
                      })
                    ],
                    1
                  )
                : _vm._e()
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.traffic_type === "search_engine"
        ? _c(
            "v-layout",
            { attrs: { row: "" } },
            [
              _vm.search_engine_type === "youtube"
                ? _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-select", {
                        attrs: {
                          label: "Youtube Search Engine",
                          chips: "",
                          "prepend-icon": "fa-tags",
                          items: _vm.youtube_search_engine
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "selection",
                            fn: function(data) {
                              return [
                                _c(
                                  "v-chip",
                                  {
                                    key: JSON.stringify(data.item),
                                    staticClass: "chip--select-multi",
                                    attrs: {
                                      selected: data.selected,
                                      disabled: data.disabled
                                    },
                                    on: {
                                      input: function($event) {
                                        data.parent.selectItem(data.item)
                                      }
                                    }
                                  },
                                  [
                                    _c("v-avatar", { staticClass: "primary" }, [
                                      _vm._v(
                                        _vm._s(
                                          data.item.slice(0, 1).toUpperCase()
                                        )
                                      )
                                    ]),
                                    _vm._v(
                                      "\n            " +
                                        _vm._s(data.item) +
                                        "\n          "
                                    )
                                  ],
                                  1
                                )
                              ]
                            }
                          }
                        ]),
                        model: {
                          value: _vm.search_engine,
                          callback: function($$v) {
                            _vm.search_engine = $$v
                          },
                          expression: "search_engine"
                        }
                      })
                    ],
                    1
                  )
                : _vm._e()
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-switch", {
                attrs: {
                  label:
                    "Geo Location Tracking: " +
                    (_vm.geo_tracking === true ? "ON" : "OFF")
                },
                model: {
                  value: _vm.geo_tracking,
                  callback: function($$v) {
                    _vm.geo_tracking = $$v
                  },
                  expression: "geo_tracking"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.geo_tracking
        ? _c(
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-flex",
                {
                  attrs: { xs12: "", md8: "", "offset-md2": "", "d-flex": "" }
                },
                [
                  _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        { attrs: { xs4: "", "d-flex": "" } },
                        [
                          _c("v-select", {
                            attrs: {
                              label: "By Country",
                              chips: "",
                              "prepend-icon": "fa-fa",
                              items: _vm.country_list
                            },
                            scopedSlots: _vm._u([
                              {
                                key: "selection",
                                fn: function(data) {
                                  return [
                                    _c(
                                      "v-chip",
                                      {
                                        key: JSON.stringify(data.item),
                                        staticClass: "chip--select-multi",
                                        attrs: {
                                          selected: data.selected,
                                          disabled: data.disabled
                                        },
                                        on: {
                                          input: function($event) {
                                            data.parent.selectItem(data.item)
                                          }
                                        }
                                      },
                                      [
                                        _c(
                                          "v-avatar",
                                          { staticClass: "primary" },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                data.item
                                                  .slice(0, 1)
                                                  .toUpperCase()
                                              )
                                            )
                                          ]
                                        ),
                                        _vm._v(
                                          "\n                " +
                                            _vm._s(data.item) +
                                            "\n              "
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ]),
                            model: {
                              value: _vm.country,
                              callback: function($$v) {
                                _vm.country = $$v
                              },
                              expression: "country"
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-flex",
                        { attrs: { xs4: "", "d-flex": "" } },
                        [
                          _c("v-select", {
                            attrs: {
                              label: "By State",
                              chips: "",
                              "prepend-icon": "map",
                              items: _vm.state_list
                            },
                            scopedSlots: _vm._u([
                              {
                                key: "selection",
                                fn: function(data) {
                                  return [
                                    _c(
                                      "v-chip",
                                      {
                                        key: JSON.stringify(data.item),
                                        staticClass: "chip--select-multi",
                                        attrs: {
                                          selected: data.selected,
                                          disabled: data.disabled
                                        },
                                        on: {
                                          input: function($event) {
                                            data.parent.selectItem(data.item)
                                          }
                                        }
                                      },
                                      [
                                        _c(
                                          "v-avatar",
                                          { staticClass: "primary" },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                data.item
                                                  .slice(0, 1)
                                                  .toUpperCase()
                                              )
                                            )
                                          ]
                                        ),
                                        _vm._v(
                                          "\n                " +
                                            _vm._s(data.item) +
                                            "\n              "
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ]),
                            model: {
                              value: _vm.state,
                              callback: function($$v) {
                                _vm.state = $$v
                              },
                              expression: "state"
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-flex",
                        { attrs: { xs4: "", "d-flex": "" } },
                        [
                          _c("v-select", {
                            attrs: {
                              label: "By City",
                              chips: "",
                              "prepend-icon": "location_city",
                              items: _vm.state_list
                            },
                            scopedSlots: _vm._u([
                              {
                                key: "selection",
                                fn: function(data) {
                                  return [
                                    _c(
                                      "v-chip",
                                      {
                                        key: JSON.stringify(data.item),
                                        staticClass: "chip--select-multi",
                                        attrs: {
                                          selected: data.selected,
                                          disabled: data.disabled
                                        },
                                        on: {
                                          input: function($event) {
                                            data.parent.selectItem(data.item)
                                          }
                                        }
                                      },
                                      [
                                        _c(
                                          "v-avatar",
                                          { staticClass: "primary" },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                data.item
                                                  .slice(0, 1)
                                                  .toUpperCase()
                                              )
                                            )
                                          ]
                                        ),
                                        _vm._v(
                                          "\n                " +
                                            _vm._s(data.item) +
                                            "\n              "
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ]),
                            model: {
                              value: _vm.city,
                              callback: function($$v) {
                                _vm.city = $$v
                              },
                              expression: "city"
                            }
                          })
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
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-switch", {
                attrs: {
                  label:
                    "Internal Browsing: " +
                    (_vm.internal_browsing === true ? "ON" : "OFF")
                },
                model: {
                  value: _vm.internal_browsing,
                  callback: function($$v) {
                    _vm.internal_browsing = $$v
                  },
                  expression: "internal_browsing"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.internal_browsing
        ? _c(
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                [
                  _c("v-switch", {
                    attrs: {
                      label:
                        "Random Browsing: " +
                        (_vm.random_browsing === true ? "ON" : "OFF")
                    },
                    model: {
                      value: _vm.random_browsing,
                      callback: function($$v) {
                        _vm.random_browsing = $$v
                      },
                      expression: "random_browsing"
                    }
                  })
                ],
                1
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.random_browsing === false
        ? _c(
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                [
                  _c("v-select", {
                    attrs: {
                      label: "Add Site Urls",
                      chips: "",
                      "prepend-icon": "public",
                      items: _vm.site_list,
                      tags: "",
                      hint: "Enter All Site URLs You Want To Browse",
                      "persistent-hint": ""
                    },
                    scopedSlots: _vm._u([
                      {
                        key: "selection",
                        fn: function(data) {
                          return [
                            _c(
                              "v-chip",
                              {
                                key: JSON.stringify(data.item),
                                staticClass: "chip--select-multi",
                                attrs: {
                                  selected: data.selected,
                                  disabled: data.disabled
                                },
                                on: {
                                  input: function($event) {
                                    data.parent.selectItem(data.item)
                                  }
                                }
                              },
                              [
                                _c("v-avatar", { staticClass: "primary" }, [
                                  _vm._v(
                                    _vm._s(data.item.slice(0, 1).toUpperCase())
                                  )
                                ]),
                                _vm._v(
                                  "\n            " +
                                    _vm._s(data.item) +
                                    "\n          "
                                )
                              ],
                              1
                            )
                          ]
                        }
                      }
                    ]),
                    model: {
                      value: _vm.sites,
                      callback: function($$v) {
                        _vm.sites = $$v
                      },
                      expression: "sites"
                    }
                  })
                ],
                1
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-switch", {
                attrs: {
                  label:
                    "Bounce Back: " + (_vm.bounce_back === true ? "ON" : "OFF")
                },
                model: {
                  value: _vm.bounce_back,
                  callback: function($$v) {
                    _vm.bounce_back = $$v
                  },
                  expression: "bounce_back"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-switch", {
                attrs: {
                  label:
                    "Play Video Embeds: " +
                    (_vm.play_video_embeds === true ? "ON" : "OFF")
                },
                model: {
                  value: _vm.play_video_embeds,
                  callback: function($$v) {
                    _vm.play_video_embeds = $$v
                  },
                  expression: "play_video_embeds"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.play_video_embeds
        ? _c(
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                [
                  _c("v-text-field", {
                    attrs: { label: "Minimum Spent To Watch", type: "number" },
                    model: {
                      value: _vm.min_spent_to_watch,
                      callback: function($$v) {
                        _vm.min_spent_to_watch = _vm._n($$v)
                      },
                      expression: "min_spent_to_watch"
                    }
                  })
                ],
                1
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c("v-switch", {
                attrs: {
                  label:
                    "Social Sharing: " +
                    (_vm.social_sharing === true ? "ON" : "OFF")
                },
                model: {
                  value: _vm.social_sharing,
                  callback: function($$v) {
                    _vm.social_sharing = $$v
                  },
                  expression: "social_sharing"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.social_sharing
        ? _c(
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-flex",
                {
                  attrs: { "d-flex": "", xs12: "", md8: "", "offset-md2": "" }
                },
                [
                  _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        { attrs: { xs6: "", "d-flex": "", "pa-1": "" } },
                        [
                          _c("v-text-field", {
                            attrs: { label: "Re-Tweets/Month", type: "number" },
                            model: {
                              value: _vm.retweets_per_month,
                              callback: function($$v) {
                                _vm.retweets_per_month = _vm._n($$v)
                              },
                              expression: "retweets_per_month"
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-flex",
                        { attrs: { xs6: "", "d-flex": "", "pa-1": "" } },
                        [
                          _c("v-text-field", {
                            attrs: {
                              label: "Favourites/Month",
                              type: "number"
                            },
                            model: {
                              value: _vm.favourites_per_month,
                              callback: function($$v) {
                                _vm.favourites_per_month = _vm._n($$v)
                              },
                              expression: "favourites_per_month"
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        { attrs: { xs6: "", "d-flex": "", "pa-1": "" } },
                        [
                          _c("v-text-field", {
                            attrs: { label: "FB Likes/Month", type: "number" },
                            model: {
                              value: _vm.facebook_likes_per_month,
                              callback: function($$v) {
                                _vm.facebook_likes_per_month = _vm._n($$v)
                              },
                              expression: "facebook_likes_per_month"
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-flex",
                        { attrs: { xs6: "", "d-flex": "", "pa-1": "" } },
                        [
                          _c("v-text-field", {
                            attrs: { label: "FB Shares/Month", type: "number" },
                            model: {
                              value: _vm.facebook_shares_per_month,
                              callback: function($$v) {
                                _vm.facebook_shares_per_month = _vm._n($$v)
                              },
                              expression: "facebook_shares_per_month"
                            }
                          })
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
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", md8: "", "offset-md2": "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs11: "" } },
                    [
                      _c("v-slider", {
                        attrs: {
                          color: "primary",
                          min: 50,
                          max: 1000,
                          step: "1",
                          "track-color": "accent",
                          label: "Search Boosts Per Month"
                        },
                        model: {
                          value: _vm.search_boost_per_month,
                          callback: function($$v) {
                            _vm.search_boost_per_month = _vm._n($$v)
                          },
                          expression: "search_boost_per_month"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs1: "" } },
                    [
                      _c("v-text-field", {
                        attrs: { "single-line": "", type: "number" },
                        model: {
                          value: _vm.search_boost_per_month,
                          callback: function($$v) {
                            _vm.search_boost_per_month = _vm._n($$v)
                          },
                          expression: "search_boost_per_month"
                        }
                      })
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
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", md8: "", "offset-md2": "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs11: "" } },
                    [
                      _c("v-slider", {
                        attrs: {
                          color: "primary",
                          min: 1,
                          max: 5,
                          step: "1",
                          "track-color": "accent",
                          label: "Minutes Spent on Visit"
                        },
                        model: {
                          value: _vm.minutes_spent_on_visit,
                          callback: function($$v) {
                            _vm.minutes_spent_on_visit = _vm._n($$v)
                          },
                          expression: "minutes_spent_on_visit"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs1: "" } },
                    [
                      _c("v-text-field", {
                        attrs: { "single-line": "", type: "number" },
                        model: {
                          value: _vm.minutes_spent_on_visit,
                          callback: function($$v) {
                            _vm.minutes_spent_on_visit = _vm._n($$v)
                          },
                          expression: "minutes_spent_on_visit"
                        }
                      })
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
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", md8: "", "offset-md2": "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs4: "", "d-flex": "" } },
                    [
                      _c("v-subheader", { staticClass: "accent--text" }, [
                        _vm._v("Approximate Daily Credit Cost")
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { xs8: "", "d-flex": "" } },
                    [
                      _c("v-text-field", {
                        attrs: { type: "number", readonly: "" },
                        model: {
                          value: _vm.approx_daily_credit_cost,
                          callback: function($$v) {
                            _vm.approx_daily_credit_cost = _vm._n($$v)
                          },
                          expression: "approx_daily_credit_cost"
                        }
                      })
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
            "v-flex",
            { attrs: { "d-flex": "", xs12: "", md8: "", "offset-md2": "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs4: "", "d-flex": "" } },
                    [
                      _c("v-subheader", { staticClass: "accent--text" }, [
                        _vm._v("Approximate Montly Credit Cost")
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { xs8: "", "d-flex": "" } },
                    [
                      _c("v-text-field", {
                        attrs: { type: "number", readonly: "" },
                        model: {
                          value: _vm.approx_monthly_cost,
                          callback: function($$v) {
                            _vm.approx_monthly_cost = _vm._n($$v)
                          },
                          expression: "approx_monthly_cost"
                        }
                      })
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
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            {
              attrs: {
                xs12: "",
                md8: "",
                "offset-md2": "",
                "text-xs-center": ""
              }
            },
            [
              _c("p", { staticClass: "red--text text--darken-2 caption" }, [
                _vm._v(
                  "NOTE*: Daily credit consumption is only an approximation as our algorithm randomises daily searches and time on site to be natural."
                )
              ])
            ]
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
            [
              _c(
                "v-btn",
                {
                  staticClass: "white--text",
                  attrs: { block: "", color: "accent" }
                },
                [
                  _vm._v("\n        Update Campaign \n        "),
                  _c("v-icon", { attrs: { right: "" } }, [_vm._v("send")])
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
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6bbcae8c", module.exports)
  }
}

/***/ }),

/***/ 968:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(969)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(971)
/* template */
var __vue_template__ = __webpack_require__(972)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\CampaignPerformance.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1aad070c", Component.options)
  } else {
    hotAPI.reload("data-v-1aad070c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 969:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(970);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("2aebb658", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1aad070c\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CampaignPerformance.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1aad070c\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CampaignPerformance.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 970:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 971:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data: function data() {
        return {
            id: 1,
            name: 'Campaign 1',
            start_date: 'Dec. 21 2017',
            total_credit_spent: 1000,
            credit_spent_today: 100,
            credit_spent_yesterday: 200,
            total_credit_last_month: 1000,
            url: 'https://google.com/test',
            items: [{ name: 'google', start_date: 'Dec.1 20017', current: null, volume: 25, weekly: 0, monthly: 0 }, { name: 'youtube', start_date: 'Dec.2 20017', current: null, volume: 25, weekly: 0, monthly: 0 }],
            pagination: {
                sortBy: 'name'
            },
            /* table */
            headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Search Engine', value: 'name', align: 'center', sortable: true }, { text: 'Start', value: 'start_date', align: 'center', sortable: false }, { text: 'Current', value: 'current', align: 'center', sortable: false }, { text: 'Volume', value: 'volume', align: 'center', sortable: false }, { text: 'Weekly', value: 'weekly', align: 'center', sortable: false }, { text: 'Monthly', value: 'monthly', align: 'center', sortable: false }]

        };
    },
    methods: {
        changeSort: function changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
        }
    }
});

/***/ }),

/***/ 972:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    { attrs: { fluid: "" } },
    [
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs6: "", "text-xs-left": "" } },
                    [
                      _c(
                        "v-card-text",
                        [
                          _c("v-card-title", [
                            _vm._v(
                              "\n              Campaign Information# " +
                                _vm._s(_vm.id) +
                                " (" +
                                _vm._s(_vm.name) +
                                ")\n            "
                            )
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs6: "", "text-xs-right": "" } },
                    [
                      _c(
                        "v-card-text",
                        [
                          _c(
                            "v-card-title",
                            [
                              _c("v-spacer"),
                              _vm._v(
                                "\n              Start Date: " +
                                  _vm._s(_vm.start_date) +
                                  "\n            "
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
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", "text-xs-right": "" } },
            [
              _c(
                "v-card-text",
                [
                  _c(
                    "v-card-title",
                    [
                      _c("v-spacer"),
                      _vm._v(
                        "\n          Total Credit Spent: " +
                          _vm._s(_vm.total_credit_spent) +
                          "\n        "
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
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", "text-xs-center": "" } },
            [_c("v-divider")],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs6: "", "text-xs-left": "" } },
                    [
                      _c(
                        "v-card-text",
                        [
                          _c("v-card-title", [
                            _vm._v(
                              "\n              Credit Spent Today: " +
                                _vm._s(_vm.credit_spent_today) +
                                "\n            "
                            )
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs6: "", "text-xs-right": "" } },
                    [
                      _c(
                        "v-card-text",
                        [
                          _c(
                            "v-card-title",
                            [
                              _c("v-spacer"),
                              _vm._v(
                                "\n              Credit Spent Yesterday: " +
                                  _vm._s(_vm.credit_spent_yesterday) +
                                  "\n            "
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
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { "d-flex": "", xs12: "" } },
            [
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs6: "", "text-xs-left": "" } },
                    [
                      _c(
                        "v-card-text",
                        [
                          _c("v-card-title", [
                            _vm._v(
                              "\n              Total  Credit Last Month: " +
                                _vm._s(_vm.total_credit_last_month) +
                                "\n            "
                            )
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { "d-flex": "", xs6: "", "text-xs-right": "" } },
                    [
                      _c(
                        "v-card-text",
                        [
                          _c(
                            "v-card-title",
                            [
                              _c("v-spacer"),
                              _vm._v(
                                "\n              URL: " +
                                  _vm._s(_vm.url) +
                                  "\n            "
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
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-flex",
            { attrs: { xs12: "", "text-xs-center": "" } },
            [_c("v-divider")],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-layout",
        { attrs: { row: "" } },
        [
          _c(
            "v-data-table",
            {
              attrs: {
                headers: _vm.headers,
                items: _vm.items,
                "item-key": "id",
                pagination: _vm.pagination,
                "hide-actions": ""
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
                        _vm._l(props.headers, function(header) {
                          return _c(
                            "th",
                            {
                              key: header.text,
                              class: [
                                "column sortable",
                                _vm.pagination.descending ? "desc" : "asc",
                                header.value === _vm.pagination.sortBy
                                  ? "active"
                                  : "",
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
                        })
                      )
                    ]
                  }
                },
                {
                  key: "items",
                  fn: function(props) {
                    return [
                      _c(
                        "td",
                        { staticClass: "text-xs-center" },
                        [
                          _c(
                            "v-icon",
                            { attrs: { color: props.item.iconColor } },
                            [_vm._v(_vm._s(props.item.icon))]
                          ),
                          _vm._v(" "),
                          _c("span", { staticClass: "accent--text" }, [
                            _vm._v(_vm._s(props.item.name))
                          ])
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("td", { staticClass: "text-xs-center" }, [
                        _c("span", { staticClass: "accent--text" }, [
                          _vm._v(_vm._s(props.item.start_date))
                        ])
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "text-xs-center" }, [
                        _c("span", { staticClass: "accent--text" }, [
                          _vm._v(_vm._s(props.item.current))
                        ])
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "text-xs-center" }, [
                        _c("span", { staticClass: "accent--text" }, [
                          _vm._v(_vm._s(props.item.volume))
                        ])
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "text-xs-center" }, [
                        _c("span", { staticClass: "accent--text" }, [
                          _vm._v(_vm._s(props.item.weekly))
                        ])
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "text-xs-center" }, [
                        _c("span", { staticClass: "accent--text" }, [
                          _vm._v(_vm._s(props.item.monthly))
                        ])
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
                }
              ])
            },
            [
              _c(
                "template",
                { slot: "no-data" },
                [
                  _c(
                    "v-alert",
                    {
                      attrs: {
                        value: true,
                        type: "error",
                        outline: "",
                        icon: "warning"
                      }
                    },
                    [
                      _vm._v(
                        "\n          Oops! You Have No Campaign Performance Data Yet.\n        "
                      )
                    ]
                  )
                ],
                1
              )
            ],
            2
          )
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
    require("vue-hot-reload-api")      .rerender("data-v-1aad070c", module.exports)
  }
}

/***/ }),

/***/ 973:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: {
        fullscreen: "",
        transition: "dialog-bottom-transition",
        overlay: false
      },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _c(
        "v-card",
        [
          _c(
            "v-toolbar",
            {
              staticStyle: { "z-index": "1000" },
              attrs: { dark: "", color: "accent" }
            },
            [
              _c(
                "v-btn",
                {
                  attrs: { icon: "", dark: "" },
                  nativeOn: {
                    click: function($event) {
                      _vm.dialog = false
                    }
                  }
                },
                [
                  _c("v-icon", { attrs: { color: "primary" } }, [
                    _vm._v("close")
                  ])
                ],
                1
              ),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c("v-toolbar-title", [
                _c("span", { staticClass: "primary--text headline" }, [
                  _vm._v("Edit Traffic Campaign")
                ])
              ]),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c(
                "v-toolbar-items",
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { dark: "", flat: "", color: "primary" },
                      nativeOn: {
                        click: function($event) {
                          _vm.dialog = false
                        }
                      }
                    },
                    [_vm._v("\n          Close\n        ")]
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-tabs",
            { attrs: { fixed: "", icons: "", centered: "" } },
            [
              _c(
                "v-toolbar",
                { attrs: { color: "white", light: "" } },
                [
                  _c(
                    "v-tabs-bar",
                    { staticClass: "white" },
                    [
                      _c("v-tabs-slider", { attrs: { color: "primary" } }),
                      _vm._v(" "),
                      _vm._l(_vm.tabs, function(tab, key) {
                        return _c(
                          "v-tabs-item",
                          {
                            key: key,
                            staticClass: "accent--text",
                            attrs: { href: "#" + tab.name, ripple: "" }
                          },
                          [
                            _c("v-icon", { attrs: { color: tab.iconColor } }, [
                              _vm._v(_vm._s(tab.icon))
                            ]),
                            _vm._v(" "),
                            _c(
                              "span",
                              {
                                class:
                                  _vm.$vuetify.breakpoint.width >= 600 &&
                                  "title"
                              },
                              [
                                _vm._v(
                                  "\n              " +
                                    _vm._s(tab.name) +
                                    "\n            "
                                )
                              ]
                            )
                          ],
                          1
                        )
                      })
                    ],
                    2
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-tabs-items",
                _vm._l(_vm.tabs, function(tab, key) {
                  return _c(
                    "v-tabs-content",
                    { key: key, attrs: { id: tab.name } },
                    [
                      _c(
                        "v-card",
                        { attrs: { flat: "", light: true } },
                        [
                          _c(tab.component, {
                            tag: "component",
                            attrs: { tab: tab }
                          })
                        ],
                        1
                      )
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
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5816ac30", module.exports)
  }
}

/***/ }),

/***/ 974:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    [
      _c(
        "v-card-title",
        [
          _vm.items.length > 0
            ? _c("v-text-field", {
                attrs: {
                  "append-icon": "search",
                  label: "Search By Campaign Name",
                  "single-line": "",
                  "hide-details": ""
                },
                model: {
                  value: _vm.search,
                  callback: function($$v) {
                    _vm.search = $$v
                  },
                  expression: "search"
                }
              })
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-data-table",
        {
          attrs: {
            headers: _vm.headers,
            items: _vm.items,
            search: _vm.search,
            "item-key": "id",
            "select-all": "",
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
                          _vm.items.length > 0
                            ? _c("v-checkbox", {
                                attrs: {
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
                            : _vm._e()
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
                              }
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
                              "\n          " +
                                _vm._s(header.text) +
                                "\n        "
                            )
                          ],
                          1
                        )
                      }),
                      _vm._v(" "),
                      _c("th", [_vm._v("\n          Activity\n        ")]),
                      _vm._v(" "),
                      _c(
                        "th",
                        [
                          _vm.selected < 1
                            ? _c("span", [_vm._v("Actions")])
                            : _c(
                                "v-btn",
                                {
                                  attrs: { flat: "", icon: "", color: "error" },
                                  nativeOn: {
                                    click: function($event) {
                                      _vm.deleteSelected($event)
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
                  _c(
                    "td",
                    { staticClass: "title text-xs-center primary--text" },
                    [
                      _c("v-checkbox", {
                        attrs: { primary: "", "hide-details": "" },
                        model: {
                          value: props.selected,
                          callback: function($$v) {
                            _vm.$set(props, "selected", $$v)
                          },
                          expression: "props.selected"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("td", { staticClass: "text-xs-center primary--text" }, [
                    _c("span", { staticClass: "accent--text" }, [
                      _vm._v(_vm._s(props.item.name))
                    ])
                  ]),
                  _vm._v(" "),
                  _c("td", { staticClass: "text-xs-center primary--text" }, [
                    _c("span", { staticClass: "accent--text" }, [
                      _vm._v(_vm._s(props.item.rank))
                    ])
                  ]),
                  _vm._v(" "),
                  _c("td", { staticClass: "text-xs-center primary--text" }, [
                    _c("span", { staticClass: "accent--text" }, [
                      _vm._v(_vm._s(props.item.daily_credit_spent))
                    ])
                  ]),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "text-xs-center primary--text" },
                    [
                      _c(
                        "v-btn",
                        {
                          class: {
                            primary: props.item.smart_rank === "on",
                            accent: props.item.smart_rank === "off"
                          },
                          attrs: { icon: "", dark: "" }
                        },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(props.item.smart_rank) +
                              "\n        "
                          )
                        ]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "text-xs-center primary--text" },
                    [
                      _c(
                        "v-btn",
                        {
                          class: {
                            primary: props.item.smart_rank === "on",
                            accent: props.item.smart_rank === "off"
                          },
                          attrs: { icon: "", dark: "" }
                        },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(props.item.status) +
                              "\n        "
                          )
                        ]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "text-xs-center primary--text" },
                    [
                      _c(
                        "v-btn",
                        {
                          attrs: { flat: "", icon: "" },
                          on: {
                            click: function($event) {
                              _vm.viewActivities(props.item)
                            }
                          }
                        },
                        [
                          _c("v-icon", { attrs: { color: "primary" } }, [
                            _vm._v("\n            fa-list-ul \n          ")
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center" },
                    [
                      _c(
                        "v-btn",
                        {
                          attrs: { flat: "", icon: "", color: "accent" },
                          nativeOn: {
                            click: function($event) {
                              _vm.editItem(props.item)
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("fa-edit")])],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { flat: "", icon: "", color: "error" },
                          nativeOn: {
                            click: function($event) {
                              _vm.deleteItem(props.item)
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("fa-remove")])],
                        1
                      )
                    ],
                    1
                  )
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
                    "\n      From " +
                      _vm._s(pageStart) +
                      " to " +
                      _vm._s(pageStop) +
                      "\n    "
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
        },
        [
          _c(
            "template",
            { slot: "no-data" },
            [
              _c(
                "v-alert",
                {
                  attrs: {
                    value: true,
                    type: "error",
                    outline: "",
                    icon: "warning"
                  }
                },
                [
                  _vm._v(
                    "\n        Oops! You Have No Campaign For This Group.\n      "
                  )
                ]
              )
            ],
            1
          )
        ],
        2
      ),
      _vm._v(" "),
      _c("activity-lists"),
      _vm._v(" "),
      _c("edit-campaign")
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
    require("vue-hot-reload-api")      .rerender("data-v-6ebb42df", module.exports)
  }
}

/***/ }),

/***/ 975:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-data-table",
    {
      staticClass: "elevation-1",
      attrs: {
        headers: _vm.headers,
        items: _vm.items,
        "item-key": "id",
        "select-all": "",
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
                          header.value === _vm.pagination.sortBy ? "name" : "",
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
                        _vm._v("\n        " + _vm._s(header.text) + "\n      ")
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
                                _vm.$vuetify.breakpoint.width >= 600 && "title"
                            },
                            [_vm._v("\n          Actions\n        ")]
                          )
                        : _c(
                            "v-btn",
                            {
                              attrs: { flat: "", icon: "", color: "error" },
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
                        primary: "",
                        "hide-details": "",
                        "input-value": props.selected,
                        light: ""
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
                  { staticClass: "text-xs-center" },
                  [
                    _c("v-icon", { attrs: { color: "accent" } }, [
                      _vm._v("\n          folder\n        ")
                    ]),
                    _vm._v(" "),
                    _c("span", { staticClass: "accent--text" }, [
                      _vm._v(_vm._s(props.item.name))
                    ])
                  ],
                  1
                ),
                _vm._v(" "),
                _c("td", { staticClass: "text-xs-center" }, [
                  _c("span", { staticClass: "accent--text" }, [
                    _vm._v(_vm._s(props.item.no_of_campaigns))
                  ])
                ]),
                _vm._v(" "),
                _c("td", { staticClass: "text-xs-center accent--text" }, [
                  _vm._v(_vm._s(props.item.daily_credits_spent))
                ]),
                _vm._v(" "),
                _c("td", { staticClass: "text-xs-center accent--text" }, [
                  _vm._v(_vm._s(props.item.total_credits_spent))
                ]),
                _vm._v(" "),
                _c("td", { staticClass: "text-xs-center accent--text" }, [
                  _vm._v(_vm._s(props.item.overall_keyword_movement))
                ]),
                _vm._v(" "),
                _c(
                  "td",
                  { staticClass: "text-xs-center" },
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
                        attrs: { flat: "", icon: "", color: "error" },
                        nativeOn: {
                          click: function($event) {
                            _vm.deleteItem(props.item)
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
          key: "expand",
          fn: function(props) {
            return [_c("campaign-lists")]
          }
        },
        {
          key: "pageText",
          fn: function(ref) {
            var pageStart = ref.pageStart
            var pageStop = ref.pageStop
            return [
              _vm._v(
                "\n    From " +
                  _vm._s(pageStart) +
                  " to " +
                  _vm._s(pageStop) +
                  "\n  "
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
    },
    [
      _c(
        "template",
        { slot: "no-data" },
        [
          _c(
            "v-alert",
            {
              attrs: {
                value: true,
                type: "error",
                outline: "",
                icon: "warning"
              }
            },
            [_vm._v("\n      Oops! You Have No Group Campaign Yet!\n    ")]
          )
        ],
        1
      )
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0bfae5e9", module.exports)
  }
}

/***/ }),

/***/ 976:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(977)
}
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(979)
/* template */
var __vue_template__ = __webpack_require__(980)
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
Component.options.__file = "resources\\assets\\js\\components\\traffic\\CreateCampaign.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8237b6bc", Component.options)
  } else {
    hotAPI.reload("data-v-8237b6bc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 977:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(978);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(659)("5dd8c7d4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8237b6bc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CreateCampaign.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8237b6bc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./CreateCampaign.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 978:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(635)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 979:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TextEditor_vue__ = __webpack_require__(691);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TextEditor_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__TextEditor_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UploadButton_vue__ = __webpack_require__(692);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UploadButton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__UploadButton_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        TextEditor: __WEBPACK_IMPORTED_MODULE_0__TextEditor_vue___default.a,
        UploadButton: __WEBPACK_IMPORTED_MODULE_1__UploadButton_vue___default.a
    },
    data: function data() {
        return {
            // ? First Step
            name: '',
            url: '',
            keywords: [],
            keyword_list: [],
            group_name: '',
            group_list: ['test1', 'test2'],
            traffic_type: '', // either direct or search engine
            search_engine_type: '', // google or youtube
            search_engine: '', // link of search engine domain of google or youtube
            google_search_engine: ['https://google.com', 'https://google.com.ph'],
            youtube_search_engine: ['https://youtube.com'],
            // ? Second Step
            geo_tracking: false,
            country: '',
            country_list: ['Philippines', 'US', 'Australia'],
            state: '',
            state_list: ['State 1', 'State 2'],
            internal_browsing: true,
            random_browsing: true,
            sites: '',
            site_list: [],
            bounce_back: true,
            play_video_embeds: false,
            min_spent_to_watch: 1,
            social_sharing: false,
            retweets_per_month: 1,
            favourites_per_month: 1,
            facebook_likes_per_month: 1, // either 0 or greater than 20
            facebook_shares_per_month: 1, // either 0 or greater than 20
            search_boost_per_month: 50, // min 50
            minutes_spent_on_visit: 1,
            dialog: false
        };
    },
    computed: {
        approx_daily_credit_cost: function approx_daily_credit_cost() {
            return 1.67 * this.minutes_spent_on_visit;
        },
        approx_monthly_cost: function approx_monthly_cost() {
            return this.search_boost_per_month;
        }
    },
    mounted: function mounted() {
        var self = this;
        Bus.$on('open-create-campaign-modal', function () {
            self.dialog = true;
        });
    }
});

/***/ }),

/***/ 980:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: {
        fullscreen: "",
        transition: "dialog-bottom-transition",
        overlay: false
      },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _c(
        "v-card",
        [
          _c(
            "v-toolbar",
            {
              staticStyle: { "z-index": "1000" },
              attrs: { dark: "", color: "accent" }
            },
            [
              _c(
                "v-btn",
                {
                  attrs: { icon: "", dark: "" },
                  nativeOn: {
                    click: function($event) {
                      _vm.dialog = false
                    }
                  }
                },
                [
                  _c("v-icon", { attrs: { color: "primary" } }, [
                    _vm._v("close")
                  ])
                ],
                1
              ),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c("v-toolbar-title", [
                _c("span", { staticClass: "primary--text" }, [
                  _vm._v("Create Traffic Campaign")
                ])
              ]),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c(
                "v-toolbar-items",
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { dark: "", flat: "", color: "primary" },
                      nativeOn: {
                        click: function($event) {
                          _vm.dialog = false
                        }
                      }
                    },
                    [_vm._v("\n          Close\n        ")]
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-container",
            [
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "name",
                          label: "Campaign Name",
                          "single-line": "",
                          "prepend-icon": "fa-fa"
                        },
                        model: {
                          value: _vm.name,
                          callback: function($$v) {
                            _vm.name = $$v
                          },
                          expression: "name"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-select", {
                        attrs: {
                          label: "Group Name",
                          "prepend-icon": "folder",
                          chips: "",
                          items: _vm.group_list
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "selection",
                            fn: function(data) {
                              return [
                                _c(
                                  "v-chip",
                                  {
                                    key: JSON.stringify(data.item),
                                    staticClass: "chip--select-multi",
                                    attrs: {
                                      selected: data.selected,
                                      disabled: data.disabled
                                    },
                                    on: {
                                      input: function($event) {
                                        data.parent.selectItem(data.item)
                                      }
                                    }
                                  },
                                  [
                                    _c(
                                      "v-avatar",
                                      { staticClass: "accent white--text" },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            data.item.slice(0, 1).toUpperCase()
                                          )
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "span",
                                      { staticClass: "primary--text" },
                                      [_vm._v(_vm._s(data.item))]
                                    )
                                  ],
                                  1
                                )
                              ]
                            }
                          }
                        ]),
                        model: {
                          value: _vm.group_name,
                          callback: function($$v) {
                            _vm.group_name = $$v
                          },
                          expression: "group_name"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-flex",
                { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                [
                  _c("v-text-field", {
                    attrs: {
                      name: "url",
                      label: "Url",
                      "prepend-icon": "link",
                      hint:
                        "Enter your website URL starting with http:// or https://",
                      "persistent-hint": "",
                      "single-line": ""
                    },
                    model: {
                      value: _vm.url,
                      callback: function($$v) {
                        _vm.url = $$v
                      },
                      expression: "url"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-radio-group",
                        {
                          attrs: { mandatory: true, row: "" },
                          model: {
                            value: _vm.traffic_type,
                            callback: function($$v) {
                              _vm.traffic_type = $$v
                            },
                            expression: "traffic_type"
                          }
                        },
                        [
                          _c("v-radio", {
                            attrs: {
                              color: "primary",
                              label: "Via Search Engine",
                              value: "search_engine"
                            }
                          }),
                          _vm._v(" "),
                          _c("v-radio", {
                            attrs: {
                              color: "info",
                              label: "Via Direct Traffic",
                              value: "direct_traffic"
                            }
                          })
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
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-select", {
                        attrs: {
                          label: "Keywords",
                          chips: "",
                          tags: "",
                          "prepend-icon": "fa-tags",
                          items: _vm.keyword_list
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "selection",
                            fn: function(data) {
                              return [
                                _c(
                                  "v-chip",
                                  {
                                    key: JSON.stringify(data.item),
                                    staticClass: "chip--select-multi",
                                    attrs: {
                                      selected: data.selected,
                                      disabled: data.disabled
                                    },
                                    on: {
                                      input: function($event) {
                                        data.parent.selectItem(data.item)
                                      }
                                    }
                                  },
                                  [
                                    _c("v-avatar", { staticClass: "primary" }, [
                                      _vm._v(
                                        _vm._s(
                                          data.item.slice(0, 1).toUpperCase()
                                        )
                                      )
                                    ]),
                                    _vm._v(
                                      "\n                " +
                                        _vm._s(data.item) +
                                        "\n              "
                                    )
                                  ],
                                  1
                                )
                              ]
                            }
                          }
                        ]),
                        model: {
                          value: _vm.keywords,
                          callback: function($$v) {
                            _vm.keywords = $$v
                          },
                          expression: "keywords"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _vm.traffic_type === "search_engine"
                ? _c(
                    "v-layout",
                    { attrs: { row: "" } },
                    [
                      _c(
                        "v-flex",
                        { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                        [
                          _c(
                            "v-radio-group",
                            {
                              attrs: { mandatory: true, row: "" },
                              model: {
                                value: _vm.search_engine_type,
                                callback: function($$v) {
                                  _vm.search_engine_type = $$v
                                },
                                expression: "search_engine_type"
                              }
                            },
                            [
                              _c("v-radio", {
                                attrs: {
                                  color: "blue darken-2",
                                  label: "Google Search Engine",
                                  value: "google",
                                  "prepend-icon": "fa-google"
                                }
                              }),
                              _vm._v(" "),
                              _c("v-radio", {
                                attrs: {
                                  color: "red darken-4",
                                  label: "Youtube Search Engine",
                                  value: "youtube",
                                  "prepend-icon": "fa-youtube"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.traffic_type === "search_engine"
                ? _c(
                    "v-layout",
                    { attrs: { row: "" } },
                    [
                      _vm.search_engine_type === "google"
                        ? _c(
                            "v-flex",
                            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                            [
                              _c("v-select", {
                                attrs: {
                                  label: "Google Search Engine",
                                  chips: "",
                                  "prepend-icon": "fa-tags",
                                  items: _vm.google_search_engine
                                },
                                scopedSlots: _vm._u([
                                  {
                                    key: "selection",
                                    fn: function(data) {
                                      return [
                                        _c(
                                          "v-chip",
                                          {
                                            key: JSON.stringify(data.item),
                                            staticClass: "chip--select-multi",
                                            attrs: {
                                              selected: data.selected,
                                              disabled: data.disabled
                                            },
                                            on: {
                                              input: function($event) {
                                                data.parent.selectItem(
                                                  data.item
                                                )
                                              }
                                            }
                                          },
                                          [
                                            _c(
                                              "v-avatar",
                                              { staticClass: "primary" },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    data.item
                                                      .slice(0, 1)
                                                      .toUpperCase()
                                                  )
                                                )
                                              ]
                                            ),
                                            _vm._v(
                                              "\n                " +
                                                _vm._s(data.item) +
                                                "\n              "
                                            )
                                          ],
                                          1
                                        )
                                      ]
                                    }
                                  }
                                ]),
                                model: {
                                  value: _vm.search_engine,
                                  callback: function($$v) {
                                    _vm.search_engine = $$v
                                  },
                                  expression: "search_engine"
                                }
                              })
                            ],
                            1
                          )
                        : _vm._e()
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.traffic_type === "search_engine"
                ? _c(
                    "v-layout",
                    { attrs: { row: "" } },
                    [
                      _vm.search_engine_type === "youtube"
                        ? _c(
                            "v-flex",
                            { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                            [
                              _c("v-select", {
                                attrs: {
                                  label: "Youtube Search Engine",
                                  chips: "",
                                  "prepend-icon": "fa-tags",
                                  items: _vm.youtube_search_engine
                                },
                                scopedSlots: _vm._u([
                                  {
                                    key: "selection",
                                    fn: function(data) {
                                      return [
                                        _c(
                                          "v-chip",
                                          {
                                            key: JSON.stringify(data.item),
                                            staticClass: "chip--select-multi",
                                            attrs: {
                                              selected: data.selected,
                                              disabled: data.disabled
                                            },
                                            on: {
                                              input: function($event) {
                                                data.parent.selectItem(
                                                  data.item
                                                )
                                              }
                                            }
                                          },
                                          [
                                            _c(
                                              "v-avatar",
                                              { staticClass: "primary" },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    data.item
                                                      .slice(0, 1)
                                                      .toUpperCase()
                                                  )
                                                )
                                              ]
                                            ),
                                            _vm._v(
                                              "\n                " +
                                                _vm._s(data.item) +
                                                "\n              "
                                            )
                                          ],
                                          1
                                        )
                                      ]
                                    }
                                  }
                                ]),
                                model: {
                                  value: _vm.search_engine,
                                  callback: function($$v) {
                                    _vm.search_engine = $$v
                                  },
                                  expression: "search_engine"
                                }
                              })
                            ],
                            1
                          )
                        : _vm._e()
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-switch", {
                        attrs: {
                          label:
                            "Geo Location Tracking: " +
                            (_vm.geo_tracking === true ? "ON" : "OFF")
                        },
                        model: {
                          value: _vm.geo_tracking,
                          callback: function($$v) {
                            _vm.geo_tracking = $$v
                          },
                          expression: "geo_tracking"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _vm.geo_tracking
                ? _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        {
                          attrs: {
                            xs12: "",
                            md8: "",
                            "offset-md2": "",
                            "d-flex": ""
                          }
                        },
                        [
                          _c(
                            "v-layout",
                            { attrs: { row: "", wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                { attrs: { xs4: "", "d-flex": "" } },
                                [
                                  _c("v-select", {
                                    attrs: {
                                      label: "By Country",
                                      chips: "",
                                      "prepend-icon": "fa-fa",
                                      items: _vm.country_list
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "selection",
                                        fn: function(data) {
                                          return [
                                            _c(
                                              "v-chip",
                                              {
                                                key: JSON.stringify(data.item),
                                                staticClass:
                                                  "chip--select-multi",
                                                attrs: {
                                                  selected: data.selected,
                                                  disabled: data.disabled
                                                },
                                                on: {
                                                  input: function($event) {
                                                    data.parent.selectItem(
                                                      data.item
                                                    )
                                                  }
                                                }
                                              },
                                              [
                                                _c(
                                                  "v-avatar",
                                                  { staticClass: "primary" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        data.item
                                                          .slice(0, 1)
                                                          .toUpperCase()
                                                      )
                                                    )
                                                  ]
                                                ),
                                                _vm._v(
                                                  "\n                    " +
                                                    _vm._s(data.item) +
                                                    "\n                  "
                                                )
                                              ],
                                              1
                                            )
                                          ]
                                        }
                                      }
                                    ]),
                                    model: {
                                      value: _vm.country,
                                      callback: function($$v) {
                                        _vm.country = $$v
                                      },
                                      expression: "country"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs4: "", "d-flex": "" } },
                                [
                                  _c("v-select", {
                                    attrs: {
                                      label: "By State",
                                      chips: "",
                                      "prepend-icon": "map",
                                      items: _vm.state_list
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "selection",
                                        fn: function(data) {
                                          return [
                                            _c(
                                              "v-chip",
                                              {
                                                key: JSON.stringify(data.item),
                                                staticClass:
                                                  "chip--select-multi",
                                                attrs: {
                                                  selected: data.selected,
                                                  disabled: data.disabled
                                                },
                                                on: {
                                                  input: function($event) {
                                                    data.parent.selectItem(
                                                      data.item
                                                    )
                                                  }
                                                }
                                              },
                                              [
                                                _c(
                                                  "v-avatar",
                                                  { staticClass: "primary" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        data.item
                                                          .slice(0, 1)
                                                          .toUpperCase()
                                                      )
                                                    )
                                                  ]
                                                ),
                                                _vm._v(
                                                  "\n                    " +
                                                    _vm._s(data.item) +
                                                    "\n                  "
                                                )
                                              ],
                                              1
                                            )
                                          ]
                                        }
                                      }
                                    ]),
                                    model: {
                                      value: _vm.state,
                                      callback: function($$v) {
                                        _vm.state = $$v
                                      },
                                      expression: "state"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs4: "", "d-flex": "" } },
                                [
                                  _c("v-select", {
                                    attrs: {
                                      label: "By City",
                                      chips: "",
                                      "prepend-icon": "location_city",
                                      items: _vm.state_list
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "selection",
                                        fn: function(data) {
                                          return [
                                            _c(
                                              "v-chip",
                                              {
                                                key: JSON.stringify(data.item),
                                                staticClass:
                                                  "chip--select-multi",
                                                attrs: {
                                                  selected: data.selected,
                                                  disabled: data.disabled
                                                },
                                                on: {
                                                  input: function($event) {
                                                    data.parent.selectItem(
                                                      data.item
                                                    )
                                                  }
                                                }
                                              },
                                              [
                                                _c(
                                                  "v-avatar",
                                                  { staticClass: "primary" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        data.item
                                                          .slice(0, 1)
                                                          .toUpperCase()
                                                      )
                                                    )
                                                  ]
                                                ),
                                                _vm._v(
                                                  "\n                    " +
                                                    _vm._s(data.item) +
                                                    "\n                  "
                                                )
                                              ],
                                              1
                                            )
                                          ]
                                        }
                                      }
                                    ]),
                                    model: {
                                      value: _vm.city,
                                      callback: function($$v) {
                                        _vm.city = $$v
                                      },
                                      expression: "city"
                                    }
                                  })
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
                : _vm._e(),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-switch", {
                        attrs: {
                          label:
                            "Internal Browsing: " +
                            (_vm.internal_browsing === true ? "ON" : "OFF")
                        },
                        model: {
                          value: _vm.internal_browsing,
                          callback: function($$v) {
                            _vm.internal_browsing = $$v
                          },
                          expression: "internal_browsing"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _vm.internal_browsing
                ? _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                        [
                          _c("v-switch", {
                            attrs: {
                              label:
                                "Random Browsing: " +
                                (_vm.random_browsing === true ? "ON" : "OFF")
                            },
                            model: {
                              value: _vm.random_browsing,
                              callback: function($$v) {
                                _vm.random_browsing = $$v
                              },
                              expression: "random_browsing"
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.random_browsing === false
                ? _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                        [
                          _c("v-select", {
                            attrs: {
                              label: "Add Site Urls",
                              chips: "",
                              "prepend-icon": "public",
                              items: _vm.site_list,
                              tags: "",
                              hint: "Enter All Site URLs You Want To Browse",
                              "persistent-hint": ""
                            },
                            scopedSlots: _vm._u([
                              {
                                key: "selection",
                                fn: function(data) {
                                  return [
                                    _c(
                                      "v-chip",
                                      {
                                        key: JSON.stringify(data.item),
                                        staticClass: "chip--select-multi",
                                        attrs: {
                                          selected: data.selected,
                                          disabled: data.disabled
                                        },
                                        on: {
                                          input: function($event) {
                                            data.parent.selectItem(data.item)
                                          }
                                        }
                                      },
                                      [
                                        _c(
                                          "v-avatar",
                                          { staticClass: "primary" },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                data.item
                                                  .slice(0, 1)
                                                  .toUpperCase()
                                              )
                                            )
                                          ]
                                        ),
                                        _vm._v(
                                          "\n                " +
                                            _vm._s(data.item) +
                                            "\n              "
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ]),
                            model: {
                              value: _vm.sites,
                              callback: function($$v) {
                                _vm.sites = $$v
                              },
                              expression: "sites"
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-switch", {
                        attrs: {
                          label:
                            "Bounce Back: " +
                            (_vm.bounce_back === true ? "ON" : "OFF")
                        },
                        model: {
                          value: _vm.bounce_back,
                          callback: function($$v) {
                            _vm.bounce_back = $$v
                          },
                          expression: "bounce_back"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-switch", {
                        attrs: {
                          label:
                            "Play Video Embeds: " +
                            (_vm.play_video_embeds === true ? "ON" : "OFF")
                        },
                        model: {
                          value: _vm.play_video_embeds,
                          callback: function($$v) {
                            _vm.play_video_embeds = $$v
                          },
                          expression: "play_video_embeds"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _vm.play_video_embeds
                ? _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                        [
                          _c("v-text-field", {
                            attrs: {
                              label: "Minimum Spent To Watch",
                              type: "number"
                            },
                            model: {
                              value: _vm.min_spent_to_watch,
                              callback: function($$v) {
                                _vm.min_spent_to_watch = _vm._n($$v)
                              },
                              expression: "min_spent_to_watch"
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-switch", {
                        attrs: {
                          label:
                            "Social Sharing: " +
                            (_vm.social_sharing === true ? "ON" : "OFF")
                        },
                        model: {
                          value: _vm.social_sharing,
                          callback: function($$v) {
                            _vm.social_sharing = $$v
                          },
                          expression: "social_sharing"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _vm.social_sharing
                ? _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        {
                          attrs: {
                            "d-flex": "",
                            xs12: "",
                            md8: "",
                            "offset-md2": ""
                          }
                        },
                        [
                          _c(
                            "v-layout",
                            { attrs: { row: "", wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                {
                                  attrs: { xs6: "", "d-flex": "", "pa-1": "" }
                                },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "Re-Tweets/Month",
                                      type: "number"
                                    },
                                    model: {
                                      value: _vm.retweets_per_month,
                                      callback: function($$v) {
                                        _vm.retweets_per_month = _vm._n($$v)
                                      },
                                      expression: "retweets_per_month"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                {
                                  attrs: { xs6: "", "d-flex": "", "pa-1": "" }
                                },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "Favourites/Month",
                                      type: "number"
                                    },
                                    model: {
                                      value: _vm.favourites_per_month,
                                      callback: function($$v) {
                                        _vm.favourites_per_month = _vm._n($$v)
                                      },
                                      expression: "favourites_per_month"
                                    }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-layout",
                            { attrs: { row: "", wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                {
                                  attrs: { xs6: "", "d-flex": "", "pa-1": "" }
                                },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "FB Likes/Month",
                                      type: "number"
                                    },
                                    model: {
                                      value: _vm.facebook_likes_per_month,
                                      callback: function($$v) {
                                        _vm.facebook_likes_per_month = _vm._n(
                                          $$v
                                        )
                                      },
                                      expression: "facebook_likes_per_month"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                {
                                  attrs: { xs6: "", "d-flex": "", "pa-1": "" }
                                },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "FB Shares/Month",
                                      type: "number"
                                    },
                                    model: {
                                      value: _vm.facebook_shares_per_month,
                                      callback: function($$v) {
                                        _vm.facebook_shares_per_month = _vm._n(
                                          $$v
                                        )
                                      },
                                      expression: "facebook_shares_per_month"
                                    }
                                  })
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
                : _vm._e(),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    {
                      attrs: {
                        "d-flex": "",
                        xs12: "",
                        md8: "",
                        "offset-md2": ""
                      }
                    },
                    [
                      _c(
                        "v-layout",
                        { attrs: { row: "", wrap: "" } },
                        [
                          _c(
                            "v-flex",
                            { attrs: { "d-flex": "", xs11: "" } },
                            [
                              _c("v-slider", {
                                attrs: {
                                  color: "primary",
                                  min: 50,
                                  max: 1000,
                                  step: "1",
                                  "track-color": "accent",
                                  label: "Search Boosts Per Month"
                                },
                                model: {
                                  value: _vm.search_boost_per_month,
                                  callback: function($$v) {
                                    _vm.search_boost_per_month = _vm._n($$v)
                                  },
                                  expression: "search_boost_per_month"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { "d-flex": "", xs1: "" } },
                            [
                              _c("v-text-field", {
                                attrs: { "single-line": "", type: "number" },
                                model: {
                                  value: _vm.search_boost_per_month,
                                  callback: function($$v) {
                                    _vm.search_boost_per_month = _vm._n($$v)
                                  },
                                  expression: "search_boost_per_month"
                                }
                              })
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
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    {
                      attrs: {
                        "d-flex": "",
                        xs12: "",
                        md8: "",
                        "offset-md2": ""
                      }
                    },
                    [
                      _c(
                        "v-layout",
                        { attrs: { row: "", wrap: "" } },
                        [
                          _c(
                            "v-flex",
                            { attrs: { "d-flex": "", xs11: "" } },
                            [
                              _c("v-slider", {
                                attrs: {
                                  color: "primary",
                                  min: 1,
                                  max: 5,
                                  step: "1",
                                  "track-color": "accent",
                                  label: "Minutes Spent on Visit"
                                },
                                model: {
                                  value: _vm.minutes_spent_on_visit,
                                  callback: function($$v) {
                                    _vm.minutes_spent_on_visit = _vm._n($$v)
                                  },
                                  expression: "minutes_spent_on_visit"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { "d-flex": "", xs1: "" } },
                            [
                              _c("v-text-field", {
                                attrs: { "single-line": "", type: "number" },
                                model: {
                                  value: _vm.minutes_spent_on_visit,
                                  callback: function($$v) {
                                    _vm.minutes_spent_on_visit = _vm._n($$v)
                                  },
                                  expression: "minutes_spent_on_visit"
                                }
                              })
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
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    {
                      attrs: {
                        "d-flex": "",
                        xs12: "",
                        md8: "",
                        "offset-md2": ""
                      }
                    },
                    [
                      _c(
                        "v-layout",
                        { attrs: { row: "", wrap: "" } },
                        [
                          _c(
                            "v-flex",
                            { attrs: { xs4: "", "d-flex": "" } },
                            [
                              _c(
                                "v-subheader",
                                { staticClass: "accent--text" },
                                [_vm._v("Approximate Daily Credit Cost")]
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { xs8: "", "d-flex": "" } },
                            [
                              _c("v-text-field", {
                                attrs: { type: "number", readonly: "" },
                                model: {
                                  value: _vm.approx_daily_credit_cost,
                                  callback: function($$v) {
                                    _vm.approx_daily_credit_cost = _vm._n($$v)
                                  },
                                  expression: "approx_daily_credit_cost"
                                }
                              })
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
                    "v-flex",
                    {
                      attrs: {
                        "d-flex": "",
                        xs12: "",
                        md8: "",
                        "offset-md2": ""
                      }
                    },
                    [
                      _c(
                        "v-layout",
                        { attrs: { row: "", wrap: "" } },
                        [
                          _c(
                            "v-flex",
                            { attrs: { xs4: "", "d-flex": "" } },
                            [
                              _c(
                                "v-subheader",
                                { staticClass: "accent--text" },
                                [_vm._v("Approximate Montly Credit Cost")]
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { xs8: "", "d-flex": "" } },
                            [
                              _c("v-text-field", {
                                attrs: { type: "number", readonly: "" },
                                model: {
                                  value: _vm.approx_monthly_cost,
                                  callback: function($$v) {
                                    _vm.approx_monthly_cost = _vm._n($$v)
                                  },
                                  expression: "approx_monthly_cost"
                                }
                              })
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
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    {
                      attrs: {
                        xs12: "",
                        md8: "",
                        "offset-md2": "",
                        "text-xs-center": ""
                      }
                    },
                    [
                      _c(
                        "p",
                        { staticClass: "red--text text--darken-2 caption" },
                        [
                          _vm._v(
                            "NOTE*: Daily credit consumption is only an approximation as our algorithm randomises daily searches and time on site to be natural."
                          )
                        ]
                      )
                    ]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-btn",
                        {
                          staticClass: "white--text",
                          attrs: { block: "", color: "accent" }
                        },
                        [
                          _vm._v("\n            Create New Post\n            "),
                          _c("v-icon", { attrs: { right: "" } }, [
                            _vm._v("send")
                          ])
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
    require("vue-hot-reload-api")      .rerender("data-v-8237b6bc", module.exports)
  }
}

/***/ }),

/***/ 981:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "main-layout",
    [
      _c("action-panel", {
        attrs: {
          lifetime: _vm.lifetime,
          monthly: _vm.monthly,
          "project-count": _vm.socialCount
        }
      }),
      _vm._v(" "),
      _c(
        "v-layout",
        {
          staticStyle: { "background-color": "white" },
          attrs: { row: "", wrap: "" }
        },
        [
          _c(
            "v-flex",
            { attrs: { xs6: "", md4: "" } },
            [
              _c(
                "v-btn",
                {
                  attrs: { color: "accent", dark: "" },
                  nativeOn: {
                    click: function($event) {
                      _vm.AddCampaign()
                    }
                  }
                },
                [
                  _vm._v("\n        Add New Campaigns\n        "),
                  _c(
                    "v-icon",
                    { staticClass: "primary--text", attrs: { right: "" } },
                    [_vm._v("\n          fa-plus\n        ")]
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-flex",
            {
              attrs: { xs6: "", md4: "", "offset-md4": "", "text-xs-right": "" }
            },
            [
              _c(
                "v-btn",
                { attrs: { color: "accent", dark: "" } },
                [
                  _vm._v("\n        Total Credits\n        "),
                  _c(
                    "v-icon",
                    { staticClass: "primary--text", attrs: { right: "" } },
                    [_vm._v("\n          fa-money\n        ")]
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
        "v-tabs",
        { attrs: { fixed: "", icons: "", centered: "" } },
        [
          _c(
            "v-toolbar",
            { attrs: { color: "white", light: "" } },
            [
              _c(
                "v-tabs-bar",
                {
                  staticClass: "white",
                  attrs: { slot: "extension" },
                  slot: "extension"
                },
                [
                  _c("v-tabs-slider", { attrs: { color: "primary" } }),
                  _vm._v(" "),
                  _vm._l(_vm.tabs, function(tab, key) {
                    return _c(
                      "v-tabs-item",
                      {
                        key: key,
                        staticClass: "accent--text",
                        attrs: { href: "#" + tab.name, ripple: "" }
                      },
                      [
                        _c("v-icon", { attrs: { color: tab.iconColor } }, [
                          _vm._v(_vm._s(tab.icon))
                        ]),
                        _vm._v(" "),
                        _c(
                          "span",
                          {
                            class:
                              _vm.$vuetify.breakpoint.width >= 600 && "headline"
                          },
                          [
                            _vm._v(
                              "\n            " +
                                _vm._s(tab.name) +
                                "\n          "
                            )
                          ]
                        )
                      ],
                      1
                    )
                  })
                ],
                2
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-tabs-items",
            _vm._l(_vm.tabs, function(tab, key) {
              return _c(
                "v-tabs-content",
                { key: key, attrs: { id: tab.name } },
                [
                  _c(
                    "v-card",
                    { attrs: { flat: "", light: true } },
                    [
                      _c(tab.component, {
                        tag: "component",
                        attrs: { tab: tab }
                      })
                    ],
                    1
                  )
                ],
                1
              )
            })
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("create-campaign")
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
    require("vue-hot-reload-api")      .rerender("data-v-58b73554", module.exports)
  }
}

/***/ })

});