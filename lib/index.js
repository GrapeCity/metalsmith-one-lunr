'use strict';

const Plugin = require('./class/plugin');

/**
 * Metalsmith plugin to implement client side search functionality based on lunr
 * @param {*} - config object
 * @return {function} - the metalsmith plugin
 */
function plugin(config) {
  let plugin = new Plugin(config);

  return function(files, metalsmith, done) {

    //For each of the actions
    if (plugin.enabled) {
      if(plugin.hasActions()) {
        plugin.Logger('metalsmith-one-lunr: start... [' + Date.now() + ']');
        plugin.actions.forEach(action => {
          //Iterate over the files...
          action.replace(plugin, files);
        });
        plugin.Logger('metalsmith-one-lunr: end [' + Date.now() + '].');
      }
      else {
        plugin.Logger('metalsmith-one-lunr: no action to perform');
      }
    } else {
      plugin.Logger('metalsmith-one-lunr: disabled at config level');
    }
    done();
  };
}
module.exports = plugin;
