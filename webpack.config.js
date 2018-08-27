const path = require('path');
const fs = require('fs');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // CSS / POSTCSS
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            // TS
            {
                test: /\.ts$/,
                use: [
                    'ts-loader'
                ]
            }
        ]
    }
};