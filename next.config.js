/**
 * @type {import('next').NextConfig}
 */
/* eslint-disable no-undef */
const path = require('path');

module.exports = {
    webpack: (config, options) => {
        config.resolve.modules.push(path.resolve(__dirname, 'src'));

        const { isServer } = options;
        if (isServer) {
            config.devtool = 'source-map';
        }

        config.module.exprContextCritical = false;

        return config;
    },
    env: {},
    productionBrowserSourceMaps: true,
    swcMinify: true,
};
