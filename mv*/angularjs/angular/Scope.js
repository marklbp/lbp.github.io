function createScope(providers, instanceCache) {
  var scope = new Scope();
  /*
    scope = {
      $id: '001'
      ,$parent: null
      ,$destructor: function(){}
      ,this: this
      ,$root: this
      ,$$phase: null
      ,$$watchers: null
      ,$$nextSibling: null
      ,$$prevSibling: null
      ,$$childHead: null
      ,$$childTail: null
      ,$$asyncQueue: []
      ,$$listeners: {}
    }
  */
  scope.$service = createInjector(scope, providers, instanceCache);
  /*
    scope = factoryScope = scope || {}
    providers = factories = providers || angularService
    instanceCache = instanceCache || {};

    scope.$service = function(value){
      if (!(value in instanceCache)) {
        var factory = factories[value];
        if (!factory) throw Error("Unknown provider for '"+value+"'.");
        instanceCache[value] = invoke(factoryScope, factory);
        /*
          function invoke(self, fn, args){
            args = args || [];
            var injectNames = injectionArgs(fn);
            var i = injectNames.length;
            while(i--) {
              args.unshift(injector(injectNames[i]));
            }
            return fn.apply(self, args);
          }
        */
        /*
      }
      return instanceCache[value];
    }
  */
  scope.$service.eager();
  /*
    forEach(factories, function(factory, name){
      if (factory.$eager)
        injector(name);

      if (factory.$creation)
        throw new Error("Failed to register service '" + name +
        "': $creation property is unsupported. Use $eager:true or see release notes.");
    });
  */
  return scope;
}

function Scope() {
  this.$id = nextUid();

  this.$$phase = this.$parent 
               = this.$$watchers 
               = this.$$nextSibling 
               = this.$$prevSibling 
               = this.$$childHead 
               = this.$$childTail 
               = null;

  this.$destructor = noop;

  this['this'] = this.$root =  this;

  this.$$asyncQueue = [];

  this.$$listeners = {};
  /*
    {
      $id
      ,$parent
      ,$destructor
      ,this
      ,$root
      ,$$phase
      ,$$watchers
      ,$$nextSibling
      ,$$prevSibling
      ,$$childHead
      ,$$childTail
      ,$$asyncQueue
      ,$$listeners
    }
  */
}

Scope.prototype = {
  $new: function(Class, curryArguments) {
    var Child = function() {}; // should be anonymous; This is so that when the minifier munges
      // the name it does not become random set of chars. These will then show up as class
      // name in the debugger.
    var child;
    Child.prototype = this;
    child = new Child();
    child['this'] = child;
    child.$$listeners = {};
    child.$parent = this;
    child.$id = nextUid();
    child.$$asyncQueue = [];
    child.$$phase = child.$$watchers =
      child.$$nextSibling = child.$$childHead = child.$$childTail = null;
    child.$$prevSibling = this.$$childTail;
    if (this.$$childHead) {
      this.$$childTail.$$nextSibling = child;
      this.$$childTail = child;
    } else {
      this.$$childHead = this.$$childTail = child;
    }
    // short circuit if we have no class
    if (Class) {
      // can't use forEach, we need speed!
      var ClassPrototype = Class.prototype;
      for(var key in ClassPrototype) {
        child[key] = bind(child, ClassPrototype[key]);
      }
      this.$service.invoke(child, Class, curryArguments);
    }
    return child;
  },

  $watch: function(watchExp, listener) {
    var scope = this,
        get = compileToFn(watchExp, 'watch'),
        listenFn = compileToFn(listener || noop, 'listener'),
        array = scope.$$watchers,
        watcher = {
          fn: listenFn,
          last: Number.NaN, // NaN !== NaN. We used this to force $watch to fire on first run.
          get: get
        };

    if (!array) {
      array = scope.$$watchers = [];
    }
    // we use unshift since we use a while loop in $digest for speed.
    // the while loop reads in reverse order.
    array.unshift(watcher);

    return function() {
      angularArray.remove(array, watcher);
    };
  },

  $digest: function() {
    var watch, value, last,
        watchers,
        asyncQueue,
        length,
        dirty, ttl = 100,
        next, current, target = this;

    if (target.$$phase) {
      throw Error(target.$$phase + ' already in progress');
    }
    do {

      dirty = false;
      current = target;
      do {
        current.$$phase = '$digest';
        asyncQueue = current.$$asyncQueue;
        while(asyncQueue.length) {
          try {
            current.$eval(asyncQueue.shift());
          } catch (e) {
            current.$service('$exceptionHandler')(e);
          }
        }
        if ((watchers = current.$$watchers)) {
          // process our watches
          length = watchers.length;
          while (length--) {
            try {
              watch = watchers[length];
              value = watch.get(current);
              last = watch.last;
              if (value !== last && !equals(value, last)) {
                dirty = true;
                watch.fn(current, watch.last = copy(value), last);
              }
            } catch (e) {
              current.$service('$exceptionHandler')(e);
            }
          }
        }

        current.$$phase = null;

        if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
          while(current !== target && !(next = current.$$nextSibling)) {
            current = current.$parent;
          }
        }
      } while ((current = next));

      if(!(ttl--)) {
        throw Error('100 $digest() iterations reached. Aborting!');
      }
    } while (dirty);
  },

  $destroy: function() {
    if (this.$root == this) return; // we can't remove the root node;
    this.$emit('$destroy');
    var parent = this.$parent;

    if (parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;
    if (parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;
    if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
    if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;
  },

  $eval: function(expr) {
    var fn = isString(expr)
      ? expressionCompile(expr)
      : expr || noop;
    return fn(this);
  },

  $evalAsync: function(expr) {
    this.$$asyncQueue.push(expr);
  },

  $apply: function(expr) {
    try {
      return this.$eval(expr);
    } catch (e) {
      this.$service('$exceptionHandler')(e);
    } finally {
      this.$root.$digest();
    }
  },

  $on: function(name, listener) {
    var namedListeners = this.$$listeners[name];
    if (!namedListeners) {
      this.$$listeners[name] = namedListeners = [];
    }
    namedListeners.push(listener);

    return function() {
      angularArray.remove(namedListeners, listener);
    };
  },

  $emit: function(name, args) {
    var empty = [],
        namedListeners,
        canceled = false,
        scope = this,
        event = {
          name: name,
          targetScope: scope,
          cancel: function(){canceled = true;}
        },
        listenerArgs = concat([event], arguments, 1),
        i, length;

    do {
      namedListeners = scope.$$listeners[name] || empty;
      event.currentScope = scope;
      for (i=0, length=namedListeners.length; i<length; i++) {
        try {
          namedListeners[i].apply(null, listenerArgs);
          if (canceled) return;
        } catch (e) {
          scope.$service('$exceptionHandler')(e);
        }
      }
      //traverse upwards
      scope = scope.$parent;
    } while (scope);
  },

  $broadcast: function(name, args) {
    var target = this,
        current = target,
        next = target,
        event = { name: name,
                  targetScope: target },
        listenerArgs = concat([event], arguments, 1);

    //down while you can, then up and next sibling or up and next sibling until back at root
    do {
      current = next;
      event.currentScope = current;
      forEach(current.$$listeners[name], function(listener) {
        try {
          listener.apply(null, listenerArgs);
        } catch(e) {
          current.$service('$exceptionHandler')(e);
        }
      });

      // Insanity Warning: scope depth-first traversal
      // yes, this code is a bit crazy, but it works and we have tests to prove it!
      // this piece should be kept in sync with the traversal in $digest
      if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
        while(current !== target && !(next = current.$$nextSibling)) {
          current = current.$parent;
        }
      }
    } while ((current = next));
  }
};