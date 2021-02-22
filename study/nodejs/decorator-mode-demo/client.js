var ConcreteComponent = require('./concreteComponent');
var ConcreteDecoratorA = require('./concreteDecoratorA');
var ConcreteDecoratorB = require('./concreteDecoratorB');

console.log('-----output for class of ConcreteComponent------');
concreteComponent = new ConcreteComponent();
concreteComponent.operation();

console.log('-----output for class of ConcreteDecoratorA------');
concreteDecoratorA = new ConcreteDecoratorA();
concreteDecoratorA.operation();

console.log('-----output for class of ConcreteDecoratorB------');
concreteDecoratorB = new ConcreteDecoratorB();
concreteDecoratorB.operation();
concreteDecoratorB.addedBehavior();