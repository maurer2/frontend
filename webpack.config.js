const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/base/index.js',
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
            // HTML
            /*
            {
                test: /\.(html)$/,
                // include: path.join(__dirname, 'src'),
                use: {
                    loader: 'html-loader',
                    options: {
                        interpolate: true
                    }
                }
            },
            */
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/base/markup.html'
        })
    ]
};