/* eslint-disable no-undef */
const path = require('path');
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withSourceMaps({
    webpack: (config, options) => {
        config.resolve.modules.push(path.resolve(__dirname, 'src'));

        const { dev, isServer, buildId } = options;
        if (isServer) {
            config.devtool = 'source-map';
        }

        config.module.exprContextCritical = false;

        return config;
    },
    env: {},
});
