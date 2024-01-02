const path = require('path');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: require.resolve('path-browserify'),
          os: require.resolve('os-browserify/browser'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer/'),
          crypto: require.resolve('crypto-browserify'),
        },
      },
    },
  },
};
