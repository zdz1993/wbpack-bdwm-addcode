const fs = require('fs')
class WebpackMonitor {
  constructor (options) {
    this.options = options
    this.replaceHtml = ` 
            !(function () { 'use strict'; function e (e) { var t = o.createElement('script'), n = o.getElementsByTagName('script')[0]; t.async = !0, t.src = e, n.parentNode.insertBefore(t, n) } function t (e) { for (var t = e.split('.'), n = window.wmlog, o = void 0; t.length > 0 && (o = t.shift()) && n[o];)n = n[o]; n !== window.wmlog && typeof n === 'function' ? n.apply(null, [].slice.call(arguments, 1)) : i.log.push([].slice.call(arguments)) } var n = window, o = n.document, i = n.wmlogConfig; i.scriptLoader = e, i.log = [], window.wmlog = t, window.addEventListener('load', function () { e('https://s.waimai.baidu.com/xin/static/perf/dev/loader.js?' + +new Date()) }), i.speed && i.speed.sample > 0 && (t('speed.set', 'ht', +new Date()), window.addEventListener('load', function () { t('speed.set', 'lt', +new Date()), i.loaded = !0 }), o.addEventListener('DOMContentLoaded', function () { t('speed.set', 'drt', +new Date()) })) }())
        </script>
      </head>
      `
  }
  apply (compiler) {
    let _this = this
    compiler.plugin('emit', (compilation, callback) => {
      const dist = compilation.outputOptions.path || ''
      if (_this.options && Object.keys(_this.options).length && !_this.options.product) {
        // 获取参数
        for (let key of Object.keys(_this.options)) {
          let value = _this.options[key]
          let product = JSON.stringify(value.product) || 'pinzhi'
          let page = JSON.stringify(value.page) || 'all'
          let speed = JSON.stringify(value.speed) || '{"sample":1,"auto":true,"ext":[]}'
          let exception = JSON.stringify(value.exception) || '{"sample":1}'
          let html = compilation.assets[key].source()
          let varhtml = ` 
          <script>
            window.wmlogConfig = {
              'product': ${product},
              'page': ${page},
              'speed': ${speed},
              'exception': ${exception}
            }`
          let filepath = `${dist}/${key}`
          let newhtml = html.replace('</head>', `${varhtml}${_this.replaceHtml}`)
          assetsHtml(compilation, filepath, newhtml, key)
        }
      } else if (_this.options.product) {
        let array = Object.keys(compilation.assets).filter((item) => {
          return item.match(/(.html)$/)
        })
        array.forEach(item => {
          let filepath = `${dist}/${item}`
          let varhtml = `
          <script>          
            window.wmlogConfig = {
              'product': ${_this.options.product},
              'page': ${item},
              'speed': ${_this.options.speed} || '{"sample":1,"auto":true,"ext":[]}',
              'exception': ${_this.options.exception} || '{"sample":1}'
            }
          `
          let html = compilation.assets[item].source()
          let newhtml = html.replace('</head>', `${varhtml}${_this.replaceHtml}`)
          assetsHtml(compilation, filepath, newhtml, item)
        })
      } else {
        console.log('----------填写你的配置信息------------')
      }
      callback()
    })
  }
}
function assetsHtml (compilation, filepath, html, key) {
  compilation.assets[key] = {
    source () {
      return html
    },
    size () {
      return fs.statSync(filepath).size
    }
  }
}

module.exports = WebpackMonitor
