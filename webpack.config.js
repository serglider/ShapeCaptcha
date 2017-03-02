const path = require('path');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const name = 'ShapeCaptcha';
const targets = ['dist', 'demo'];
const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    output: {
        comments: false
    },
    sourceMap: true
});
const cleanPlugin = new cleanWebpackPlugin(targets, {
    exclude: ['app.js', 'index.html', 'dat-gui']
});

module.exports = env => {
    return targets.map(getConfig).map(cfg => {
        if (env === 'production') {
            cfg.plugins = [uglifyPlugin];
            cfg.output.filename = `${name.toLowerCase()}.min.js`;
        }else {
            cfg.plugins = [cleanPlugin];
        }
        return cfg;
    });
};

function getConfig(target) {

    const config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, target),
            filename: `${name.toLowerCase()}.js`,
            library: name,
            libraryTarget: 'umd'
        },
        devtool: 'source-map',
        target: 'web',
        module: {
            rules: [{
                    enforce: 'pre',
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'src'),
                    loader: 'eslint-loader',
                },
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'src'),
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                },
            ],
        }
    };

    return config;
}
