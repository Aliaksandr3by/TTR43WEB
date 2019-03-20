"use strict";
/*global __dirname*/

//const launch = require("./Properties/launchSettings.json");
//const _mode = String(launch.profiles["IIS Express"].environmentVariables.ASPNETCORE_ENVIRONMENT).toLowerCase();
//console.log(_mode);

const path = require("path");
const webpack = require("webpack"); //to access built-in plugins
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    console.table(env);
    console.table(argv);
    const devMode = Boolean(env.development);
    const mode = env.production ? "production" : "development";
    const paths = {
        ROOT: path.resolve(__dirname, "wwwroot"),
        DIST: path.resolve(__dirname, "wwwroot/public"),
        DEV: path.resolve(__dirname, "wwwroot/public"),
        SRC: path.resolve(__dirname, "src"),
        VIEW: path.resolve(__dirname, "Views")
    };
    console.table(paths);
    return {
        mode: mode,
        devtool: false,
        watch: devMode,
        target: env.platform || "web",
        entry: {
            app: `${paths.SRC}/js/index.js`
        },
        output: {
            path: devMode ? `${paths.DEV}` : `${paths.DIST}`,
            filename: devMode ? `js/[name].${mode}.bundle.js` : `js/[name].${mode}.bundle.[contenthash].js`,
            publicPath: path.PUBL
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    uglifyOptions: {
                        compress: false,
                        ie8: false,
                        toplevel: true,
                        mangle: true
                    },
                    extractComments: false,
                    sourceMap: true
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        module: {
            //Loaders are evaluated/executed from right to left. 
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        "babel-loader",
                    ],
                },
                {
                    test: /\.(png|jpg)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        "file-loader",
                    ],
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader", // translates CSS into CommonJS modules
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "postcss-loader", // Run post css actions
                            options: {
                                plugins: function () { // post css plugins, can be exported to postcss.config.js
                                    return [
                                        require("precss"),
                                        require("autoprefixer")({
                                            browsers: "last 2 versions, > 1%"
                                        }),
                                        require("css-mqpacker"),
                                        require("cssnano")({
                                            preset: "default",
                                            discardComments: {
                                                removeAll: true
                                            }
                                        }),
                                    ];
                                },
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader", // compiles Sass to CSS
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ],
        },
        plugins: [
            // new webpack.ProvidePlugin({
            //     React: "react",
            //     ReactDOM: "react-dom",
            //     PropTypes: "prop-types",
            //     M: "materialize-css"
            // }),
            new webpack.SourceMapDevToolPlugin({
                filename: "[file].map",
                lineToLine: devMode ? false : true,
                noSources: devMode ? false : true
            }),
            new WebpackMd5Hash(),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: devMode
                    ? ["**/*.js", "*****/*", "**/*.map", "***/*.css", "!**/*production*", "!***/*production*"]
                    : ["**/*"],
                dry: false, //! true для тестирования без удаления!
                verbose: true,
                cleanStaleWebpackAssets: false,
            }),
            new MiniCssExtractPlugin({
                filename: devMode ? `[name].${mode}.bundle.css` : `css/[name].${mode}.bundle.[contenthash].css`,
                chunkFilename: devMode ? `[id].${mode}.bundle.css` : "css/[id].[contenthash].css"
            }),
            new HtmlWebpackPlugin({
                inject: false,
                hash: true,
                template: `${paths.VIEW}/_BundledScriptsTemplate.cshtml`,
                filename: devMode ? `${paths.VIEW}/Shared/_BundledScriptsDev.cshtml` : `${paths.VIEW}/Shared/_BundledScriptsProd.cshtml`,
            }),
            new HtmlWebpackPlugin({
                inject: false,
                hash: true,
                template: `${paths.VIEW}/_BundledCSSTemplate.cshtml`,
                filename: devMode ? `${paths.VIEW}/Shared/_BundledCSSDev.cshtml` : `${paths.VIEW}/Shared/_BundledCSSProd.cshtml`,
            }),
            new CopyWebpackPlugin([
                { from: `${paths.SRC}/images`, to: `${paths.DIST}/image` },
                { from: `${paths.SRC}/html`, to: `${paths.DIST}/html` },
                { from: `${paths.SRC}/statics`, to: `${paths.ROOT}` },
                { from: `${paths.SRC}/StaticFilesHide`, to: `${paths.ROOT}/StaticFilesHide` },
            ])
        ]
    };
};
