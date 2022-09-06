// Parses URL parameters. Supported parameters are:
// - lang=xy: Specifies the language of the user interface.
// - touch=1: Enables a touch-style user interface.
// - storage=local: Enables HTML5 local storage.
// - chrome=0: Chromeless mode.
window.urlParams = (function (url) {
  var result = new Object();
  var idx = url.lastIndexOf('?');

  if (idx > 0)
  {
    var params = url.substring(idx + 1).split('&');

    for (var i = 0; i < params.length; i++)
    {
      idx = params[i].indexOf('=');

      if (idx > 0)
      {
        result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
      }
    }
  }

  return result;
})(window.location.href);

// Default resources are included in grapheditor resources
window.mxLoadResources = false;
// Public global variables
window.MAX_REQUEST_SIZE = window.MAX_REQUEST_SIZE  || 10485760;
window.MAX_AREA = window.MAX_AREA || 15000 * 15000;

// URLs for save and export
window.EXPORT_URL = window.EXPORT_URL || '/export';
window.SAVE_URL = window.SAVE_URL || '/save';
window.OPEN_URL = window.OPEN_URL || '/open';
window.RESOURCES_PATH = window.RESOURCES_PATH || '/static/mxgraph/editor/resources';
window.RESOURCE_BASE = window.RESOURCE_BASE || window.RESOURCES_PATH + '/grapheditor';
window.STENCIL_PATH = window.STENCIL_PATH || '/static/mxgraph/editor/stencils';
window.IMAGE_PATH = window.IMAGE_PATH || '/static/mxgraph/editor/images';
window.STYLE_PATH = window.STYLE_PATH || '/static/mxgraph/editor/styles';
window.CSS_PATH = window.CSS_PATH || '/static/mxgraph/editor/styles';
window.OPEN_FORM = window.OPEN_FORM || '/static/mxgraph/editor/open.html';

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// each properties file since only one file is loaded.
window.mxBasePath = '/static/mxgraph/src';
window.mxLanguage = window.mxLanguage || window.urlParams['lang'];
window.mxLanguages = window.mxLanguages || ['de'];
