module.exports = {
  components: 'src/**/*.{jsx,js}',
  ignore: ['src/**/*.test.{jsx,js}', 'src/**/*.spec.{jsx,js}', 'src/**/index.{jsx,js}'],
  title: 'Bulak Smart Connect React Components',
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        }
      ]
    }
  }
};