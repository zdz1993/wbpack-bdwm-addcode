

#### 介绍
  本插件是像bdwm app 插入监控代码的插件

#### 使用

  1、安装
  ```shell
    $ npm install --save-dev webpack-bdwm-addmonitor
  ```
  2、配置
    配置指定文件：
  ```javascript
    plugins: [
      new HtmlWebpackPlugin({
          filename: 'enter.html',
          template: path.join(__dirname, 'src/enter.html'),
          chunks: ['enter'],
          inject: true
        }),
        new WebpackAssetMonitor({
          'index.html': {
            product: 'pinzhi',
            page: 'index'
          },
          'enter.html': {
            product: 'pinzhi',
            page: 'index'
          }
        })
    ]
  ```
  配置全部文件：

  ```javascript
    plugins: [
      new HtmlWebpackPlugin({
          filename: 'enter.html',
          template: path.join(__dirname, 'src/enter.html'),
          chunks: ['enter'],
          inject: true
        }),
        new WebpackAssetMonitor({
            product: 'pinzhi'
        })
    ]
  ```
