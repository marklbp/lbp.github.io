var Single = require('./single_class');
var singleObj1 = new Single('2012-11-10');
var singleClass1 = singleObj1.getInstance('2012-11-10');
singleClass1.show();
var singleObj2 = new Single('2012-11-20');
var singleClass2 = singleObj2.getInstance('2012-11-20');
singleClass2.show();