const {join} = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
    console.log(env)
    console.log(argv)
    let out_dir="dist";
    return {
        entry: {
            main: join(__dirname, "src/game.ts"),
        },
        output: {
            path: join(__dirname, out_dir),
            filename: "js/[name].js",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: require.resolve('Phaser'),
                    loader: 'expose-loader',
                    options: {exposes: {globalName: 'Phaser', override: true}}
                }
            ]
        },
        devServer: {
            static: {
                directory: join(__dirname, out_dir),
            },
            host: 'localhost',
            port: 8080
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        plugins: [
            new HtmlWebpackPlugin({
                chunks: ['main'],
                filename: 'index.html',
                template: 'templates/index.html'
            }),
            new CopyPlugin({
                patterns: [
                    {from: "assets"}
                ],
            }),
        ],
    }
};
