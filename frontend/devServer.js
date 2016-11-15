var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
    hot: true,
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: { colors: true, chunks: false },
    proxy: {
        '*': {
            target: 'http://localhost:5000',
            secure: false,
            changeOrigin: true,
            cookieDomainRewrite: true,
        },
    },
});

const PORT = process.env.PORT || 8888;

server.listen(PORT, 'localhost', function(err) {
    if (err) {
        return console.log(err);
    }

    console.log(`Listening at http://localhost:${PORT}/`);
});
