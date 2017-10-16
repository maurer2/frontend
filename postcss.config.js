module.exports = {
    plugins: {
      autoprefixer: {
        browsers: ['> 1%', 'last 1 versions']
      },
      'postcss-import': {},
      'postcss-nesting': { preserveEmpty: true },
      'postcss-short-color': {},
      'postcss-inline-comment': {},
      'postcss-strip-inline-comments': {}
    }
};
