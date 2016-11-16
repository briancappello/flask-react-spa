if (process.env.NODE_ENV === 'production') {
    module.exports = require('./configureStore.prod').default;
} else {
    module.exports = require('./configureStore.dev').default;
}
