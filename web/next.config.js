/* eslint-disable */
const fs = require('fs')
const path = require('path')
const withPlugins = require('next-compose-plugins')
const withTranspileModules = require("next-transpile-modules");
const withAntdLess = require('next-plugin-antd-less')

module.exports = withPlugins([
  // withAntdLess({
  //   lessVarsFilePath: "./src/styles/antd-custom.less",
  //   cssLoaderOptions: {

  //   },
  //   webpack(config) {
  //     return config;
  //   }
  // }),
  withTranspileModules([
    "graphweibo-api",
  ])(),
], {
  publicRuntimeConfig: {
    apiRoot: process.env.API_ROOT,
    staticRoot: process.env.STATIC_ROOT,
    pdfSizeLimit: process.env.PDF_SIZE_LIMIT,
  },
});
