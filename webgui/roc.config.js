module.exports = {
  settings: {
    runtime: {
      applicationName: 'RESTen Av Sverige',
      port: 3000,
      serve: ['public', 'build/client'],
      favicon: 'favicon.png',
    },
    build: {
      reducers: 'src/redux/reducers.js',
      routes: 'src/routes/index.js',
      assets: {
        images: {
          urlLoader: {
            filetypes: ["svg","png","woff","woff2","eot","ttf"]
          }
        }
      },
      style: {
        modules: true,
      },
      resources: ["src/pure.css", "src/custom.css", "node_modules/react-select/dist/react-select.css", "roc-package-web-app-react/styles/base.css"],
    },
    dev: {
      browsersync: {
        options: {
          open: false,
        },
      },
    },
  },
  webpack: {
    output: {
        filename: "[name].js",
    }
  },
};
