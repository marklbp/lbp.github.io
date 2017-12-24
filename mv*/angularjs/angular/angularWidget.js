function inputWidgetSelector(element){
  this.directives(true);
  this.descend(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('input', inputWidgetSelector);

angularWidget('textarea', inputWidgetSelector);

var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;

angularWidget('select', function(element){
  this.descend(true);
  this.directives(true);

  var isMultiselect = element.attr('multiple'),
      expression = element.attr('ng:options'),
      onChange = expressionCompile(element.attr('ng:change') || ""),
      match;

  if (!expression) {
    return inputWidgetSelector.call(this, element);
  }
  if (! (match = expression.match(NG_OPTIONS_REGEXP))) {
    throw Error(
      "Expected ng:options in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
      " but got '" + expression + "'.");
  }

  var displayFn = expressionCompile(match[2] || match[1]),
      valueName = match[4] || match[6],
      keyName = match[5],
      groupByFn = expressionCompile(match[3] || ''),
      valueFn = expressionCompile(match[2] ? match[1] : valueName),
      valuesFn = expressionCompile(match[7]),
      // we can't just jqLite('<option>') since jqLite is not smart enough
      // to create it in <select> and IE barfs otherwise.
      optionTemplate = jqLite(document.createElement('option')),
      optGroupTemplate = jqLite(document.createElement('optgroup')),
      nullOption = false; // if false then user will not be able to select it

  return function(selectElement){

    // This is an array of array of existing option groups in DOM. We try to reuse these if possible
    // optionGroupsCache[0] is the options with no option group
    // optionGroupsCache[?][0] is the parent: either the SELECT or OPTGROUP element
    var optionGroupsCache = [[{element: selectElement, label:''}]],
        scope = this,
        model = modelAccessor(scope, element);

    // find existing special options
    forEach(selectElement.children(), function(option){
      if (option.value == '')
        // User is allowed to select the null.
        nullOption = {label:jqLite(option).text(), id:''};
    });
    selectElement.html(''); // clear contents

    selectElement.bind('change', function(){
      var optionGroup,
          collection = valuesFn(scope) || [],
          key = selectElement.val(),
          tempScope = scope.$new(),
          value, optionElement, index, groupIndex, length, groupLength;

      try {
        if (isMultiselect) {
          value = [];
          for (groupIndex = 0, groupLength = optionGroupsCache.length;
               groupIndex < groupLength;
               groupIndex++) {
            // list of options for that group. (first item has the parent)
            optionGroup = optionGroupsCache[groupIndex];

            for(index = 1, length = optionGroup.length; index < length; index++) {
              if ((optionElement = optionGroup[index].element)[0].selected) {
                if (keyName) tempScope[keyName] = key;
                tempScope[valueName] = collection[optionElement.val()];
                value.push(valueFn(tempScope));
              }
            }
          }
        } else {
          if (key == '?') {
            value = undefined;
          } else if (key == ''){
            value = null;
          } else {
            tempScope[valueName] = collection[key];
            if (keyName) tempScope[keyName] = key;
            value = valueFn(tempScope);
          }
        }
        if (isDefined(value) && model.get() !== value) {
          onChange(scope);
          model.set(value);
        }
        scope.$root.$apply();
      } finally {
        tempScope = null; // TODO(misko): needs to be $destroy
      }
    });

    scope.$watch(function(scope) {
      var optionGroups = {'':[]}, // Temporary location for the option groups before we render them
          optionGroupNames = [''],
          optionGroupName,
          optionGroup,
          option,
          existingParent, existingOptions, existingOption,
          values = valuesFn(scope) || [],
          keys = values,
          key,
          groupLength, length,
          fragment,
          groupIndex, index,
          optionElement,
          optionScope = scope.$new(),
          modelValue = model.get(),
          selected,
          selectedSet = false, // nothing is selected yet
          isMulti = isMultiselect,
          lastElement,
          element;

      try {
        if (isMulti) {
          selectedSet = new HashMap();
          if (modelValue && isNumber(length = modelValue.length)) {
            for (index = 0; index < length; index++) {
              selectedSet.put(modelValue[index], true);
            }
          }
        } else if (modelValue === null || nullOption) {
          // if we are not multiselect, and we are null then we have to add the nullOption
          optionGroups[''].push(extend({selected:modelValue === null, id:'', label:''}, nullOption));
          selectedSet = true;
        }

        // If we have a keyName then we are iterating over on object. Grab the keys and sort them.
        if(keyName) {
          keys = [];
          for (key in values) {
            if (values.hasOwnProperty(key))
              keys.push(key);
          }
          keys.sort();
        }

        // We now build up the list of options we need (we merge later)
        for (index = 0; length = keys.length, index < length; index++) {
          optionScope[valueName] = values[keyName ? optionScope[keyName]=keys[index]:index];
          optionGroupName = groupByFn(optionScope) || '';
          if (!(optionGroup = optionGroups[optionGroupName])) {
            optionGroup = optionGroups[optionGroupName] = [];
            optionGroupNames.push(optionGroupName);
          }
          if (isMulti) {
            selected = !!selectedSet.remove(valueFn(optionScope));
          } else {
            selected = modelValue === valueFn(optionScope);
            selectedSet = selectedSet || selected; // see if at least one item is selected
          }
          optionGroup.push({
              id: keyName ? keys[index] : index,   // either the index into array or key from object
              label: displayFn(optionScope) || '', // what will be seen by the user
              selected: selected                   // determine if we should be selected
            });
        }
        optionGroupNames.sort();
        if (!isMulti && !selectedSet) {
          // nothing was selected, we have to insert the undefined item
          optionGroups[''].unshift({id:'?', label:'', selected:true});
        }

        // Now we need to update the list of DOM nodes to match the optionGroups we computed above
        for (groupIndex = 0, groupLength = optionGroupNames.length;
             groupIndex < groupLength;
             groupIndex++) {
          // current option group name or '' if no group
          optionGroupName = optionGroupNames[groupIndex];

          // list of options for that group. (first item has the parent)
          optionGroup = optionGroups[optionGroupName];

          if (optionGroupsCache.length <= groupIndex) {
            // we need to grow the optionGroups
            optionGroupsCache.push(
                existingOptions = [
                  existingParent = {
                      element: optGroupTemplate.clone().attr('label', optionGroupName),
                      label: optionGroup.label
                    }
                ]
            );
            selectElement.append(existingParent.element);
          } else {
            existingOptions = optionGroupsCache[groupIndex];
            existingParent = existingOptions[0];  // either SELECT (no group) or OPTGROUP element

            // update the OPTGROUP label if not the same.
            if (existingParent.label != optionGroupName) {
              existingParent.element.attr('label', existingParent.label = optionGroupName);
            }
          }

          lastElement = null;  // start at the begining
          for(index = 0, length = optionGroup.length; index < length; index++) {
            option = optionGroup[index];
            if ((existingOption = existingOptions[index+1])) {
              // reuse elements
              lastElement = existingOption.element;
              if (existingOption.label !== option.label) {
                lastElement.text(existingOption.label = option.label);
              }
              if (existingOption.id !== option.id) {
                lastElement.val(existingOption.id = option.id);
              }
              if (existingOption.selected !== option.selected) {
                lastElement.attr('selected', option.selected);
              }
            } else {
              // grow elements
              // jQuery(v1.4.2) Bug: We should be able to chain the method calls, but
              // in this version of jQuery on some browser the .text() returns a string
              // rather then the element.
              (element = optionTemplate.clone())
                .val(option.id)
                .attr('selected', option.selected)
                .text(option.label);
              existingOptions.push(existingOption = {
                element: element,
                label: option.label,
                id: option.id,
                checked: option.selected
              });
              if (lastElement) {
                lastElement.after(element);
              } else {
                existingParent.element.append(element);
              }
              lastElement = element;
            }
          }
          // remove any excessive OPTIONs in a group
          index++; // increment since the existingOptions[0] is parent element not OPTION
          while(existingOptions.length > index) {
            existingOptions.pop().element.remove();
          }
        }
        // remove any excessive OPTGROUPs from select
        while(optionGroupsCache.length > groupIndex) {
          optionGroupsCache.pop()[0].element.remove();
        }
      } finally {
        optionScope.$destroy();
      }
    });
  };
});

angularWidget('ng:include', function(element){
  var compiler = this,
      srcExp = element.attr("src"),
      scopeExp = element.attr("scope") || '',
      onloadExp = element[0].getAttribute('onload') || ''; //workaround for jquery bug #7537
  if (element[0]['ng:compiled']) {
    this.descend(true);
    this.directives(true);
  } else {
    element[0]['ng:compiled'] = true;
    return extend(function(xhr, element){
      var scope = this,
          changeCounter = 0,
          releaseScopes = [],
          childScope,
          oldScope;

      function incrementChange(){ changeCounter++;}
      this.$watch(srcExp, incrementChange);
      this.$watch(function(scope){
        var newScope = scope.$eval(scopeExp);
        if (newScope !== oldScope) {
          oldScope = newScope;
          incrementChange();
        }
      });
      this.$watch(function(){return changeCounter;}, function(scope) {
        var src = scope.$eval(srcExp),
            useScope = scope.$eval(scopeExp);

        while(releaseScopes.length) {
          releaseScopes.pop().$destroy();
        }
        if (src) {
          xhr('GET', src, null, function(code, response){
            element.html(response);
            if (useScope) {
              childScope = useScope;
            } else {
              releaseScopes.push(childScope = scope.$new());
            }
            compiler.compile(element)(childScope);
            scope.$eval(onloadExp);
          }, false, true);
        } else {
          childScope = null;
          element.html('');
        }
      });
    }, {$inject:['$xhr.cache']});
  }
});

angularWidget('ng:switch', function (element) {
  var compiler = this,
      watchExpr = element.attr("on"),
      changeExpr = element.attr('change'),
      casesTemplate = {},
      defaultCaseTemplate,
      children = element.children(),
      length = children.length,
      child,
      when;

  if (!watchExpr) throw new Error("Missing 'on' attribute.");
  while(length--) {
    child = jqLite(children[length]);
    // this needs to be here for IE
    child.remove();
    when = child.attr('ng:switch-when');
    if (isString(when)) {
      casesTemplate[when] = compiler.compile(child);
    } else if (isString(child.attr('ng:switch-default'))) {
      defaultCaseTemplate = compiler.compile(child);
    }
  }
  children = null; // release memory;
  element.html('');

  return function(element){
    var changeCounter = 0;
    var childScope;
    var selectedTemplate;

    this.$watch(watchExpr, function(scope, value) {
      element.html('');
      if ((selectedTemplate = casesTemplate[value] || defaultCaseTemplate)) {
        changeCounter++;
        if (childScope) childScope.$destroy();
        childScope = scope.$new();
        childScope.$eval(changeExpr);
      }
    });

    this.$watch(function(){return changeCounter;}, function() {
      element.html('');
      if (selectedTemplate) {
        selectedTemplate(childScope, function(caseElement) {
          element.append(caseElement);
        });
      }
    });
  };
});

angularWidget('a', function() {
  this.descend(true);
  this.directives(true);

  return function(element) {
    var hasNgHref = ((element.attr('ng:bind-attr') || '').indexOf('"href":') !== -1);

    // turn <a href ng:click="..">link</a> into a link in IE
    // but only if it doesn't have name attribute, in which case it's an anchor
    if (!hasNgHref && !element.attr('name') && !element.attr('href')) {
      element.attr('href', '');
    }

    if (element.attr('href') === '' && !hasNgHref) {
      element.bind('click', function(event){
        event.preventDefault();
      });
    }
  };
});

angularWidget('@ng:repeat', function(expression, element){
  element.removeAttr('ng:repeat');
  element.replaceWith(jqLite('<!-- ng:repeat: ' + expression + ' -->'));
  var linker = this.compile(element);
  return function(iterStartElement){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw Error("Expected ng:repeat in form of '_item_ in _collection_' but got '" +
      expression + "'.");
    }
    lhs = match[1];
    rhs = match[2];
    match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
    if (!match) {
      throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
      keyValue + "'.");
    }
    valueIdent = match[3] || match[1];
    keyIdent = match[2];

    var childScopes = [];
    var childElements = [iterStartElement];
    var parentScope = this;
    this.$watch(function(scope){
      var index = 0,
          childCount = childScopes.length,
          collection = scope.$eval(rhs),
          collectionLength = size(collection, true),
          fragment = document.createDocumentFragment(),
          addFragmentTo = (childCount < collectionLength) ? childElements[childCount] : null,
          childScope,
          key;

      for (key in collection) {
        if (collection.hasOwnProperty(key)) {
          if (index < childCount) {
            // reuse existing child
            childScope = childScopes[index];
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            childScope.$eval();
          } else {
            // grow children
            childScope = parentScope.$new();
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$index = index;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            childScopes.push(childScope);
            linker(childScope, function(clone){
              clone.attr('ng:repeat-index', index);
              fragment.appendChild(clone[0]);
              childScope.$digest();
              childElements[index + 1] = clone;
            });
          }
          index ++;
        }
      }

      //attach new nodes buffered in doc fragment
      if (addFragmentTo) {
        addFragmentTo.after(jqLite(fragment));
      }

      // shrink children
      while(childScopes.length > index) {
        // can not use $destroy(true) since  there may be multiple iterators on same parent.
        childScopes.pop().$destroy();
        childElements.pop().remove();
      }
    });
  };
});

angularWidget("@ng:non-bindable", noop);

angularWidget('ng:view', function(element) {
  var compiler = this;

  if (!element[0]['ng:compiled']) {
    element[0]['ng:compiled'] = true;
    return annotate('$xhr.cache', '$route', function($xhr, $route, element){
      var template;
      var changeCounter = 0;

      this.$on('$afterRouteChange', function(){
        changeCounter++;
      });

      this.$watch(function(){return changeCounter;}, function() {
        var template = $route.current && $route.current.template;
        if (template) {
          //xhr's callback must be async, see commit history for more info
          $xhr('GET', template, function(code, response) {
            element.html(response);
            compiler.compile(element)($route.current.scope);
          });
        } else {
          element.html('');
        }
      });
    });
  } else {
    compiler.descend(true);
    compiler.directives(true);
  }
});

angularWidget('ng:pluralize', function(element) {
  var numberExp = element.attr('count'),
      whenExp = element.attr('when'),
      offset = element.attr('offset') || 0;

  return annotate('$locale', function($locale, element) {
    var scope = this,
        whens = scope.$eval(whenExp),
        whensExpFns = {};

    forEach(whens, function(expression, key) {
      whensExpFns[key] = compileBindTemplate(expression.replace(/{}/g,
                                             '{{' + numberExp + '-' + offset + '}}'));
    });

    scope.$watch(function() {
      var value = parseFloat(scope.$eval(numberExp));

      if (!isNaN(value)) {
        //if explicit number rule such as 1, 2, 3... is defined, just use it. Otherwise,
        //check it against pluralization rules in $locale service
        if (!whens[value]) value = $locale.pluralCat(value - offset);
         return whensExpFns[value](scope, element, true);
      } else {
        return '';
      }
    }, function(scope, newVal) {
      element.text(newVal);
    });
  });
});