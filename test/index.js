'use strict';

var EE = require('events').EventEmitter;

var test = require('tap').test;

function toMilliseconds(hrtime){
  return (hrtime[1] / 1e6);
}

function near(actual, expected, range){
  range = (range || 100) / 2;

  var lowEnd = expected - range;
  var highEnd = expected + range;

  return (actual > lowEnd) || (actual < highEnd);
}

var fnDuration = 100;

function fn(cb){
  setTimeout(cb, fnDuration);
}

function done(){}

test('fires the start event', function(t){
  var bus = new EE();
  var asyncTime = require('../')(bus);

  bus.on('start', function(evt){
    t.ok(evt.id, 'id should be defined');
    t.ok(evt.name, 'name should be defined');
    t.ok(evt.timestamp, 'timestamp should be defined');

    t.equal(evt.name, 'fn', 'name should be fn.name');
    t.ok(evt.timestamp < Date.now(), 'timestamp should be earlier than now');
    t.end();
  });

  asyncTime(fn, done);
});

test('fires the stop event', function(t){
  var bus = new EE();
  var asyncTime = require('../')(bus);

  bus.on('stop', function(evt){
    t.ok(evt.id, 'id should be defined');
    t.ok(evt.name, 'name should be defined');
    t.ok(evt.timestamp, 'timestamp should be defined');
    t.ok(evt.duration, 'duration should be defined');

    t.equal(evt.name, 'fn', 'name should be fn.name');
    t.ok(evt.timestamp < Date.now(), 'timestamp should be earlier than now');
    t.end();
  });

  asyncTime(fn, done);
});

test('start and stop id and name should be the same', function(t){
  var bus = new EE();
  var asyncTime = require('../')(bus);

  var id;
  var name;

  bus.on('start', function(evt){
    id = evt.id;
    name = evt.name;
  });

  bus.on('stop', function(evt){
    t.equal(evt.id, id, 'ids should match');
    t.equal(evt.name, name, 'names should match');
    t.end();
  });

  asyncTime(fn, done);
});

test('stop has the correct duration', function(t){
  var bus = new EE();
  var asyncTime = require('../')(bus);

  bus.on('stop', function(evt){
    var millis = toMilliseconds(evt.duration);
    t.ok(near(millis, fnDuration), 'duration should be near ' + fnDuration);
    t.end();
  });

  asyncTime(fn, done);
});
