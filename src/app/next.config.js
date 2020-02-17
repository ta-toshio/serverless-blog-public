const webpack = require('webpack')

module.exports = {
  distDir: '../../dist/functions/next',
  webpack(config, options) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.TARGET': JSON.stringify(process.env.TARGET),
      })
    )
    return config
  }
}