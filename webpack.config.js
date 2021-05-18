const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        base: './src/base/index.ts',
        webanimations: './src/webanimations/index.ts',
        cssvariables: './src/cssvariables/index.ts',
        grid: './src/grid/index.ts',
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
        new CleanWebpackPlugin([
            'dist',
            ], {}
        ),
        // Copy index.html to dist
        new CopyPlugin({
            patterns: [{
                from: './index.html',
                to: './dist',
            }]
        }),
        // Base Gallery
        new HtmlWebpackPlugin({
            filename: 'base.html',
            chunks: ['base'],
            template: 'src/base/markup.html',
            hash: true,
            title: 'Base Gallery',
        }),
        // Webanimations Gallery
        new HtmlWebpackPlugin({
            filename: 'webanimations.html',
            chunks: ['webanimations'],
            template: 'src/webanimations/markup.html',
            hash: true,
            title: 'Webanimations Gallery',
        }),
        // CSS Variables Gallery
        new HtmlWebpackPlugin({
            filename: 'cssvariables.html',
            chunks: ['cssvariables'],
            template: 'src/cssvariables/markup.html',
            hash: true,
            title: 'CSS variables Gallery',
        }),
        // Grid Gallery
        new HtmlWebpackPlugin({
            filename: 'grid.html',
            chunks: ['grid'],
            template: 'src/grid/markup.html',
            hash: true,
            title: 'Grid Gallery',
            //cache: false,
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        writeToDisk: true,
    },
};