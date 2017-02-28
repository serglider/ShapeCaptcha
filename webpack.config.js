const path = require('path');
const targets = ['dist', 'demo'];

module.exports = targets.map(getConfig);


function getConfig(target) {

    const config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, target),
            filename: 'shapecaptcha.js',
            library: "ShapeCaptcha",
            libraryTarget: 'umd'
        },
        devtool: 'source-map',
        context: __dirname,
        target: 'web',
        module: {
            rules: [{
                    enforce: 'pre',
                    test: /\.js$/,
                    include: 'src',
                    loader: 'eslint-loader',
                },
                {
                    test: /\.js$/,
                    include: 'src',
                    loader: 'babel-loader',
                },
            ],
        },
    };

    return config;
}
