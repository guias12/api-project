const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        url: require.resolve("url/"),
        util: require.resolve("util/"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer/"),
        process: require.resolve("process/browser"),
        querystring: require.resolve("querystring-es3"),
        http: false,
        https: false,
        zlib: false,
        assert: false,
        crypto: false,
      };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          URLSearchParams: ["url", "URLSearchParams"],
          URL: ["url", "URL"],
        })
      );

      return webpackConfig;
    },
  },
};
