var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config.js');
var compiler = webpack(config);

const FRONTEND_PORT = process.env.PORT || 8888;
const BACKEND_PORT = process.argv[2] || 5000;

var server = new WebpackDevServer(compiler, {
    hot: true,
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: { colors: true, chunks: false },
    proxy: {
        '*': {
            target: `http://localhost:${BACKEND_PORT}`,
            secure: false,
            changeOrigin: true,
            cookieDomainRewrite: true,
        },
    },
});

server.listen(FRONTEND_PORT, 'localhost', function(error) {
    if (error) {
        return console.log(error);
    }

    console.log(`Listening at http://localhost:${FRONTEND_PORT}/`);
    console.log(`Proxying requests to http://localhost:${BACKEND_PORT}/`);
});
