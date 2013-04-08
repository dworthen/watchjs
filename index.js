
var type = require('type')
  , flatten = require('flatten')
  , goodwin = require('goodwin');
    
var watch = module.exports = function(obj) {
    obj.watch = _watch;
    return obj;
};

function _watch(prop, fn) {

    var self = this
      , flattened = flatten(self)
      , temp = {};

    fn = fn || function () {};

    if(!prop) return;

    for (var key in flattened) {
        if(flattened.hasOwnProperty(key)) {
            goodwin.setPathValue(key, flattened[key], temp);
        }
    }

    if( type(prop) == 'function' ) {
        fn = prop;
        for(var key in flattened) {
            if(flattened.hasOwnProperty(key) && type(flattened[key]) != 'function') {
                defineProp(key);
            }
        }
    } else {
        defineProp(prop);   
    }

    function defineProp(key) {
        var fullKey = key;
        key = key.replace(/\[\d+\]/g, '\.$1\.');
        key = key.replace(/\.$/, '');
        var keyArr = key.split('.')
          , Obj = self
          , path;

        if( keyArr.length > 1 ) {
            key = keyArr.pop();
            path = keyArr.join();
            Obj = goodwin.getPathValue(path, self);
        }

        Obj.__defineSetter__(key, function(newVal) {
           var oldVal = goodwin.getPathValue(fullKey, temp);
           temp[key] = newVal;
           goodwin.setPathValue(fullKey, newVal, temp);
           fn(oldVal, newVal, fullKey); 
        });
        Obj.__defineGetter__(key, function() {
            return goodwin.getPathValue(fullKey, temp);
        })

    }

}