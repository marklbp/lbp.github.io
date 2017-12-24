function Compiler(markup, attrMarkup, directives, widgets){
  this.markup     = markup;
  this.attrMarkup = attrMarkup;
  this.directives = directives;
  this.widgets    = widgets;
}

Compiler.prototype = {


  compile: function(templateElement) {
    templateElement = jqLite(templateElement);//[document]
    var index = 0,
        template,
        parent = templateElement.parent();

    if (templateElement.length > 1) {
      throw Error("Cannot compile multiple element roots: " +
          jqLite('<div>').append(templateElement.clone()).html());
    }

    if (parent && parent[0]) {
      parent = parent[0];
      for(var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] == templateElement[0]) {
          index = i;
        }
      }
    }

    template = this.templatize(templateElement, index) || new Template();

    return function(scope, cloneConnectFn){
      var element = cloneConnectFn ? JQLitePrototype.clone.call(templateElement) : templateElement;

      scope = scope || createScope();

      element.data($$scope, scope);
      
      scope.$element = element;
      
      cloneConnectFn = cloneConnectFn||noop;
      
      cloneConnectFn(element, scope);
      
      template.link(element, scope);

      return scope;
    };
  },



  templatize: function(element, elementIndex){
    var self = this,
        widget,
        fn,
        template,
        directiveFns = self.directives,
        descend      = true,
        directives   = true,
        
        elementName  = nodeName_(element),

        elementNamespace = elementName.indexOf(':') > 0 ? lowercase(elementName).replace(':', '-') : '',

        selfApi = {
          compile: bind(self, self.compile),
          descend: function(value){ 
            if(isDefined(value)) descend = value; 
            return descend;
          },
          directives: function(value){ 
            if(isDefined(value)) directives = value; 
            return directives;
          },
          scope: function(value){ 
            if(isDefined(value)) template.newScope = template.newScope || value; 
            return template.newScope;
          }
        };

    element.addClass(elementNamespace);
    template = new Template();

    eachAttribute(element, function(value, name){
      if (!widget) {
        widget = self.widgets('@' + name);
        if (widget) {
          element.addClass('ng-attr-widget');
          widget = bind(selfApi, widget, value, element);
        }
      }
    });

    if (!widget) {
      widget = self.widgets(elementName);
      if (widget) {
        if (elementNamespace)
          element.addClass('ng-widget');
        widget = bind(selfApi, widget, element);
      }
    }

    if (widget) {
      descend = false;
      directives = false;
      var parent = element.parent();
      template.addLinkFn(widget.call(selfApi, element));
      if (parent && parent[0]) {
        element = jqLite(parent[0].childNodes[elementIndex]);
      }
    }

    if (descend){
      // 处理文本标签
      for(var i=0, child,bTextNode,childNodes=element[0].childNodes; i<childNodes.length; i++) {
        child = childNodes[i];
        bTextNode = isTextNode(child);
        if (bTextNode) {
          forEach(self.markup, function(markup){
            if (i < childNodes.length) {
              var textNode = jqLite(child);
              var text = textNode.text();
              markup.call(selfApi, text, textNode, element);
            }
          });
        }
      }
    }

    if (directives) {
      // 处理属性节点或者directives节点
      eachAttribute(element, function(value, name){
        forEach(self.attrMarkup, function(markup){
          markup.call(selfApi, value, name, element);
        });
      });

      eachAttribute(element, function(value, name){
        fn = directiveFns[name];
        if (fn) {
          element.addClass('ng-directive');
          template.addLinkFn((directiveFns[name]).call(selfApi, value, element));
        }
      });
    }

    // 处理非文本的节点
    if (descend) {
      eachNode(element, function(child, i){
        template.addChild(i, self.templatize(child, i));
      });
    }

    //template.empty() === template.linkFns.length === 0 && template.paths.length === 0
    return template.empty() ? null : template;
  }
};

function compile(element) {
  var compileObj = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget);
  /*
    compileObj = {
      markup: angularTextMarkup,
      attrMarkup: angularAttrMarkup,
      directives: angularDirective,
      widgets: angularWidget
    }
  */
  var compileFn = compileObj.compile(element);
  /*
    compileFn = function(scope, cloneConnectFn){
      var element = cloneConnectFn ? JQLitePrototype.clone.call(templateElement) : templateElement;
      scope = scope || createScope();
      element.data($$scope, scope);
      scope.$element = element;
      cloneConnectFn = cloneConnectFn||noop;
      cloneConnectFn(element, scope);
      template.link(element, scope);
      return scope;
    }
  */
  return compileFn
}