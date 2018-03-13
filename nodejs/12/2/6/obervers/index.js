var Fober = require('./firstObserver')
  , Sober = require('./secondObserver')
  , Oble  = require('./observable');

var fober = new Fober()
  , sober = new Sober()
  , oble  = new Oble();

oble.addObser(fober);
oble.addObser(sober);

oble.doAction();