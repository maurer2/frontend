const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        base: './src/base/index.ts',
    },
    output: {
        filename: '[name]/main.js',
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
                include: path.join(__dirname, 'src'),
                use: [
                    'ts-loader'
                ]
            }
        ]
    },
    resolve: {
        modules: [__dirname, 'node_modules'],
        alias: {
            '@app': 'src/',
        },
        extensions: ['*', '.js', '.ts', '.css']
    },
    plugins: [
        // Cleanup
        /*
        new CleanWebpackPlugin([
            'dist',
            ], {}
        ),
        */
        // Base Gallery
        new HtmlWebpackPlugin({
            filename: 'base.html',
            chunks: ['base'],
            template: 'src/base/markup.html',
            hash: true,
            title: 'Base Gallery',
        })
    ]
};