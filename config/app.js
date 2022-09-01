const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    development: {
        port: process.env.PORT || '8080',
    },
    test: {
        port: process.env.PORT,
    },
    production: {
        port: process.env.PORT,
    }
}
