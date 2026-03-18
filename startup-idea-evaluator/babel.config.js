module.exports = {
  presets: [
    'babel-preset-expo',
    '@babel/preset-flow'  // add this line
  ],

  plugins: [
    'babel-plugin-transform-flow-strip-types'
  ]

};