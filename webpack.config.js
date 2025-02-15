const path = require('path');

module.exports = {
  mode: 'development', // 배포 시 'production'으로 변경하세요.
  entry: './src/popup/popup.js',
  output: {
    filename: 'popup.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
};
