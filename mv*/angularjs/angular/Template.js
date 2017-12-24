function Template() {
  this.paths = [];
  this.children = [];
  this.linkFns = [];
  this.newScope = false;
}

Template.prototype = {
  link: function(element, scope) {
    var childScope = scope;
    if (this.newScope) {
      childScope = isFunction(this.newScope) ? scope.$new(this.newScope(scope)) : scope.$new();
      element.data($$scope, childScope);
    }
    forEach(this.linkFns, function(fn) {
      try {
        childScope.$service.invoke(childScope, fn, [element]);
      } catch (e) {
        childScope.$service('$exceptionHandler')(e);
      }
    });
    var i,
        childNodes = element[0].childNodes,
        children = this.children,
        paths = this.paths,
        length = paths.length;
    for (i = 0; i < length; i++) {
      children[i].link(jqLite(childNodes[paths[i]]), childScope);
    }
  },


  addLinkFn:function(linkingFn) {
    if (linkingFn) {
      if (!linkingFn.$inject)
        linkingFn.$inject = [];
      this.linkFns.push(linkingFn);
    }
  },


  addChild: function(index, template) {
    if (template) {
      this.paths.push(index);
      this.children.push(template);
    }
  },

  empty: function() {
    return this.linkFns.length === 0 && this.paths.length === 0;
  }
};