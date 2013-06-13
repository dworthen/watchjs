/**
 * API
 *
 * watch(Object|Array)
 *
 * obj.subsribe([prop|push|remove], function(oldVal, newVal, fullKey))
 */

var type = require('type')
  , flatten = require('flatten')
  , goodwin = require('goodwin');

/**
 *      
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 *
 * TODO
 * override getters and setters
 */
var watch = module.exports = function(obj) {
  obj.__subscribed = flatten(obj);
  obj.__push = [];
  obj.__remove = [];
  obj.__temp = {};

  for(var key in obj.__subscribed) {
    if (obj.__subscribed.hasOwnProperty(key)) {
      obj.__subscribed[key] = [];
    }
  }

  if(type(obj) == 'array') {
    obj.push = _push;
    obj.remove = _remove;
  }

  obj.subscribe = _subscribe;
};

function _subscribe(prop, fn) {
  var self = this
    , flattened = flatten(self);

  fn = fn || function() {};

  if(!prop) return;

  if(type(prop) == 'function') {
    for(var key in self.__subscribed) {
      // self.__subscribed[key].push(prop);
    }
  } else if(prop.toLowerCase() == 'push') {
    self.__push.push(fn);
  } else if (prop.toLowerCase() == 'remove') {
    self.__remove.push(fn);
  } else {
    // self.__subscribed[prop].push(fn);
  }

  function sub(prop) {
    switch(type(prop)) {
      case 'array':
        
      break;
      default:

      break;
    }
  }

}

function _push() {
  var self = this;

  for( var i = 0, l = arguments.length; i < l; i++ )
  {
    self[self.length] = arguments[i];
    for(var key in self.__push) {
      if(type(self.__push[key]) == 'function') {
        self.__push[key](arguments[i], self.length - 1, self);
      }
    }
  }
  return self.length;
}

function _remove(from, to) {
  var _to = !to ? from + 1 : to + 1;
  _to = _to == 0 ? undefined : _to;
  var deleted = this.slice(from, _to);

  var self = this;
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;

  for(var i = 0; i < deleted.length; i++) {
    for(var key in self.__remove) {
      if(type(self.__remove[key]) == 'function') {
        self.__remove[key](deleted[i], self.length + i, deleted);
      }
    }
  }

  return this.push.apply(this, rest);
}

    
// var watch = module.exports = function(obj) {
//   obj.watch = _watch;
//   obj.watchArray = watchArray;
//   return obj;
// };

// function _watch(prop, fn) {

//   var self = this
//     , flattened = flatten(self)
//     , temp = {};

//   fn = fn || function () {};

//   if(!prop) return;

//   for (var key in flattened) {
//     if(flattened.hasOwnProperty(key)) {
//       goodwin.setPathValue(key, flattened[key], temp);
//     }
//   }

//   if( type(prop) == 'function' ) {
//     fn = prop;
//     for(var key in flattened) {
//       if(flattened.hasOwnProperty(key) && type(flattened[key]) != 'function') {
//         defineProp(key);
//       }
//     }
//   } else {
//     defineProp(prop);   
//   }

//   function defineProp(key) {
//     var fullKey = key;
//     key = key.replace(/\[(\d+)\]/g, '\.$1\.');
//     key = key.replace(/\.$/, '');
//     var keyArr = key.split('.')
//       , Obj = self
//       , path;

//     console.log(keyArr);

//     if( keyArr.length > 1 ) {
//       key = keyArr.pop();
//       path = keyArr.join();
//       Obj = goodwin.getPathValue(path, self);
//     }

//     Obj.__defineSetter__(key, function(newVal) {
//       var oldVal = goodwin.getPathValue(fullKey, temp);
//       if(oldVal != newVal) {
//         goodwin.setPathValue(fullKey, newVal, temp);
//         fn(oldVal, newVal, fullKey); 
//       }
//     });

//     Obj.__defineGetter__(key, function() {
//       return goodwin.getPathValue(fullKey, temp);
//     });

//   }

// }

// /*
// What do I want to do?

//  */

// function watchArray(array, fn) {
//   if(type(array) != 'array') return;

//   array.push = function() {
//     for( var i = 0, l = arguments.length; i < l; i++ )
//     {
//       this[this.length] = arguments[i];
//     }
//     return this.length;
//   }
// }