
const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    entry: {
        main: './src/app/app.ts',
        worker: './src/worker/worker.ts',
    },
    output: {
        filename: '[name].js',
        path: resolveApp('./dist/'),
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: '/node_modules/',
            }
        ]
    },
    devtool: "inline-source-map",
};
