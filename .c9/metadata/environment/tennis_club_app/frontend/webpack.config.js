{"filter":false,"title":"webpack.config.js","tooltip":"/tennis_club_app/frontend/webpack.config.js","undoManager":{"mark":1,"position":1,"stack":[[{"start":{"row":0,"column":0},"end":{"row":28,"column":0},"action":"insert","lines":["const path = require('path');","","module.exports = {","  entry: './src/index.js',","  output: {","    path: path.resolve(__dirname, 'public'),","    filename: 'bundle.js'","  },","  module: {","    rules: [","      {","        test: /\\.js$/,","        exclude: /node_modules/,","        use: {","          loader: 'babel-loader',","          options: {","            presets: ['@babel/preset-env', '@babel/preset-react']","          }","        }","      }","    ]","  },","  devServer: {","    contentBase: path.join(__dirname, 'public'),","    compress: true,","    port: 9000","  }","};",""],"id":1}],[{"start":{"row":0,"column":0},"end":{"row":28,"column":0},"action":"remove","lines":["const path = require('path');","","module.exports = {","  entry: './src/index.js',","  output: {","    path: path.resolve(__dirname, 'public'),","    filename: 'bundle.js'","  },","  module: {","    rules: [","      {","        test: /\\.js$/,","        exclude: /node_modules/,","        use: {","          loader: 'babel-loader',","          options: {","            presets: ['@babel/preset-env', '@babel/preset-react']","          }","        }","      }","    ]","  },","  devServer: {","    contentBase: path.join(__dirname, 'public'),","    compress: true,","    port: 9000","  }","};",""],"id":2},{"start":{"row":0,"column":0},"end":{"row":28,"column":0},"action":"insert","lines":["const path = require('path');","","module.exports = {","  entry: './src/index.js',","  output: {","    path: path.resolve(__dirname, 'public'),","    filename: 'bundle.js'","  },","  module: {","    rules: [","      {","        test: /\\.js$/,","        exclude: /node_modules/,","        use: {","          loader: 'babel-loader',","          options: {","            presets: ['@babel/preset-env', '@babel/preset-react']","          }","        }","      }","    ]","  },","  devServer: {","    contentBase: path.join(__dirname, 'public'),","    compress: true,","    port: 9000","  }","};",""]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":28,"column":0},"end":{"row":28,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":117,"mode":"ace/mode/javascript"}},"timestamp":1726031463965,"hash":"da2e0e9e5bf14b586c60871733c627f1aca8c7c9"}