const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, args) => {

    const isProduction = args && args['mode'] === 'production';
    console.log('');
    console.log(isProduction ? 'PRODUCTION BUILD' : 'DEVELOPMENT BUILD');
    console.log('');

    const config = {
        entry: {
            popup: './popup.tsx'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        target: 'web',
        devtool: isProduction ? false : 'source-map',
        optimization: {
            splitChunks: {
                // always create vendor.js
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'scripts/vendor',
                        chunks: 'initial',
                        enforce: true,
                    },
                },
            },
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.html', '.txt', ".css", ".scss"],
            fallback: {
                fs: false
            }
        },
        module: {
            rules: [{
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    "css-modules-typescript-loader",
                    // Translates CSS into CommonJS
                    {loader: "css-loader", options: {modules: true}},
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }, {
                test: /\.(ts|tsx)$/,
                // eslint
                enforce: 'pre',
                use: [
                    {
                        options: {
                            eslintPath: require.resolve('eslint'),
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                exclude: /node_modules/,
            }, {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                }],
            },],
        },
        watchOptions: {
            aggregateTimeout: 100,
            ignored: /node_modules/,
            poll: 300
        },
        plugins: [
            new webpack.EnvironmentPlugin({
                NODE_ENV: isProduction ? 'production' : 'development',
                DEBUG: !isProduction
            }),
            new CopyPlugin({
                patterns: [{
                    from: "public"
                },],
            }),
            new HtmlWebpackPlugin({
                template: 'template.html',
                filename: '[name].html'
            })
        ],
    };

    if (isProduction) {
        config.optimization.minimize = true;
        config.optimization.minimizer = [
            new TerserPlugin({extractComments: false}),
        ]
    }

    return config;
}
