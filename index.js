const fs = require('fs')
class WebpackMonitor {
  constructor (options) {
    this.options = options
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
            <script src='https://s.waimai.baidu.com/xin/static/perf/dev/deploy.js'></script>            
            <script>
              window.wmlogConfig = {
                'product': ${product},
                'page': ${page},
                'speed': ${speed},
                'exception': ${exception}
              }
            </script>
          </head>
          `
          let filepath = `${dist}/${key}`
          let newhtml = html.replace('</head>', `${varhtml}`)
          assetsHtml(compilation, filepath, newhtml, key)
        }
      } else if (_this.options.product) {
        let array = Object.keys(compilation.assets).filter((item) => {
          return item.match(/(.html)$/)
        })
        array.forEach(item => {
          let filepath = `${dist}/${item}`
          let varhtml = `
            <script src='https://s.waimai.baidu.com/xin/static/perf/dev/deploy.js'></script>            
            <script>          
              window.wmlogConfig = {
                'product': ${_this.options.product},
                'page': ${item},
                'speed': ${_this.options.speed} || '{"sample":1,"auto":true,"ext":[]}',
                'exception': ${_this.options.exception} || '{"sample":1}'
              }
            </script>
          </head>
          `
          let html = compilation.assets[item].source()
          let newhtml = html.replace('</head>', `${varhtml}`)
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
