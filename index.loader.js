module.exports = function() {
};

module.exports.pitch = function (remainingRequest) {

  // Webpack 1.7.3 uses this.resourcePath. Leaving in remaining request for possibly older versions
  // of Webpack
  var configFilePath = this.resourcePath || remainingRequest;
  this.cacheable(true);

  if (!configFilePath || configFilePath.trim() === '') {
    var msg = 'You specified the bootstrap-webpack with no configuration file. Please specify' +
      ' the configuration file, like: \'bootstrap-webpack!./bootstrap.config.js\' or use' +
      ' require(\'bootstrap-webpack\').';
    console.error('ERROR: ' + msg);
    throw new Error(msg);
  }

  var config = require(configFilePath);
  var styleLoader;
  this.options.module.loaders.forEach(function(x){
    if(x.test.test(".less")){
      styleLoader = x.loader.replace("style-loader", "style-loader/useable")
    }
  })
  if(!styleLoader){
    var msg = "you should have a working less-loader configured";
    console.error("ERROR: " + msg);
    throw new Error(msg);
  }
  var styleDarkLoaderCommand = 'module.exports.bootstrapDarkStyle = require(' + JSON.stringify('-!' + styleLoader + '!' +
    require.resolve('./bootstrap-dark-styles.loader.js') + '!' + configFilePath) + ');';
  var styleLightLoaderCommand = 'module.exports.bootstrapLightStyle = require(' + JSON.stringify('-!' + styleLoader + '!' +
    require.resolve('./bootstrap-light-styles.loader.js') + '!' + configFilePath) + ');';
  var jsLoaderCommand = 'require(' + JSON.stringify('-!' +
    require.resolve('./bootstrap-scripts.loader.js') + '!' + configFilePath) + ');';
  var result = [styleDarkLoaderCommand, styleLightLoaderCommand, jsLoaderCommand].join('\n');
  return result;
};
