/* eslint-disable */
const path = require('path')
const withPlugins = require('next-compose-plugins')
const withTranspileModules = require("next-transpile-modules");
const images = require("next-images");

module.exports = withPlugins([
  withTranspileModules([
    "graphweibo-api",
  ])(),
  [images, {}],
], {
  publicRuntimeConfig: {
    apiRoot: process.env.API_ROOT,
    staticRoot: process.env.STATIC_ROOT,
    pdfSizeLimit: process.env.PDF_SIZE_LIMIT,
  },
});
