'use strict';

var assert = require('assert');

var uuid = require('uuid');
var asyncDone = require('async-done');

function createTimer(emitter){
  assert(emitter && emitter.on, 'An EventEmitter must be passed as an argument.');

  if(emitter.setMaxListeners){
    emitter.setMaxListeners(0);
  }

  function asyncTime(fn, cb){
    var id = uuid.v4();
    var name = fn.name;
    var startTime = process.hrtime();

    emitter.emit('start', {
      id: id,
      name: name,
      timestamp: Date.now()
    });

    asyncDone(fn, function(err, res){
      emitter.emit('stop', {
        id: id,
        name: name,
        timestamp: Date.now(),
        duration: process.hrtime(startTime),
      });
    });
  }

  return asyncTime;
}

module.exports = createTimer;
