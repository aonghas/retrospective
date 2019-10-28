module.exports = {
  productionSourceMap: false,
  // publicPath: "./",
  devServer: {
    host: "localhost",
    proxy: {
      "/mocks/_api": {
        target: "http://localhost:3000/",
        changeOrigin: true
      }
    }
  }
  // modify the location of the generated HTML file.
  // make sure to do this only in production.
  // chainWebpack: (config) => {
  //     if (process.env.NODE_ENV === 'production') {
  //         config.plugin('html').tap((opts) => {
  //             opts[0].filename = './index.aspx';
  //             return opts;
  //         });
  //     }
  // },
};
