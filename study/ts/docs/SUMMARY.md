# Summary

* [Getting Started](getting-started.md)
  * [Why TypeScript](why-typescript.md)
* [JavaScript](javascript/recap.md)
  * [Equality](javascript/equality.md)
  * [References](javascript/references.md)
  * [Null vs. Undefined](javascript/null-undefined.md)
  * [this](javascript/this.md)
  * [Closure](javascript/closure.md)
  * [Number](javascript/number.md)
  * [Truthy](javascript/truthy.md)
* [Future JavaScript Now](future-javascript.md)
  * [Classes](classes.md)
    * [Classes Emit](classes-emit.md)
  * [Arrow Functions](arrow-functions.md)
  * [Rest Parameters](rest-parameters.md)
  * [let](let.md)
  * [const](const.md)
  * [Destructuring](destructuring.md)
  * [Spread Operator](spread-operator.md)
  * [for...of](for...of.md)
  * [Iterators](iterators.md)
  * [Template Strings](template-strings.md)
  * [Promise](promise.md)
  * [Generators](generators.md)
  * [Async Await](async-await.md)
* [Project](project/project.md)
  * [Compilation Context](project/compilation-context.md)
    * [tsconfig.json](project/tsconfig.md)
    * [Which Files?](project/files.md)
  * [Declaration Spaces](project/declarationspaces.md)
  * [Modules](project/modules.md)
    * [File Module Details](project/external-modules.md)
    * [globals.d.ts](project/globals.md)
  * [Namespaces](project/namespaces.md)
  * [Dynamic Import Expressions](project/dynamic-import-expressions.md)
* [Node.js QuickStart](quick/nodejs.md)
* [Browser QuickStart](quick/browser.md)
* [Library QuickStart](quick/library.md)
* [TypeScript's Type System](types/type-system.md)
  * [JS Migration Guide](types/migrating.md)
  * [@types](types/@types.md)
  * [Ambient Declarations](types/ambient/intro.md)
    * [Declaration Files](types/ambient/d.ts.md)
    * [Variables](types/ambient/variables.md)
  * [Interfaces](types/interfaces.md)
  * [Enums](enums.md)
  * [`lib.d.ts`](types/lib.d.ts.md)
  * [Functions](types/functions.md)
  * [Callable](types/callable.md)
  * [Type Assertion](types/type-assertion.md)
  * [Freshness](types/freshness.md)
  * [Type Guard](types/typeGuard.md)
  * [Literal Types](types/literal-types.md)
  * [Readonly](types/readonly.md)
  * [Generics](types/generics.md)
  * [Type Inference](types/type-inference.md)
  * [Type Compatibility](types/type-compatibility.md)
  * [Never Type](types/never.md)
  * [Discriminated Unions](types/discriminated-unions.md)
  * [Index Signatures](types/index-signatures.md)
  * [Moving Types](types/moving-types.md)
  * [Exception Handling](types/exceptions.md)
  * [Mixins](types/mixins.md)
* [JSX](jsx/tsx.md)
  * [React](jsx/react.md)
  * [Non React JSX](jsx/others.md)
* [Options](options/intro.md)
  * [noImplicitAny](options/noImplicitAny.md)
  * [strictNullChecks](options/strictNullChecks.md)
* [Errors in TypeScript](errors/main.md)
  * [Interpreting Errors](errors/interpreting-errors.md)
  * [Common Errors](errors/common-errors.md)
* [NPM](npm/index.md)
* [Testing](testing/intro.md)
  * [Jest](testing/jest.md)
  * [Cypress](testing/cypress.md)
* [Tools](tools/intro.md)
  * [Prettier](tools/prettier.md)
  * [Husky](tools/husky.md)
  * [ESLint](tools/eslint.md)
  * [Changelog](tools/changelog.md)
* [TIPs](tips/main.md)
  * [String Based Enums](tips/stringEnums.md)
  * [Nominal Typing](tips/nominalTyping.md)
  * [Stateful Functions](tips/statefulFunctions.md)
  * [Currying](tips/currying.md)
  * [Type Instantiation](tips/typeInstantiation.md)
  * [Lazy Object Literal Initialization](tips/lazyObjectLiteralInitialization.md)
  * [Classes are Useful](tips/classesAreUseful.md)
  * [Avoid Export Default](tips/defaultIsBad.md)
  * [Limit Property Setters](tips/propertySetters.md)
  * [`outFile` caution](tips/outFile.md)
  * [JQuery tips](tips/jquery.md)
  * [static constructors](tips/staticConstructor.md)
  * [singleton pattern](tips/singleton.md)
  * [Function parameters](tips/functionParameters.md)
  * [Build Toggles](tips/build-toggles.md)
  * [Barrel](tips/barrel.md)
  * [Create Arrays](tips/create-arrays.md)
  * [Typesafe Event Emitter](tips/typed-event.md)
* [StyleGuide](styleguide/styleguide.md)
* [TypeScript Compiler Internals](compiler/overview.md)
  * [Program](compiler/program.md)
  * [AST](compiler/ast.md)
    * [TIP: Visit Children](compiler/ast-tip-children.md)
    * [TIP: SyntaxKind enum](compiler/ast-tip-syntaxkind.md)
    * [Trivia](compiler/ast-trivia.md)
  * [Scanner](compiler/scanner.md)
  * [Parser](compiler/parser.md)
    * [Parser Functions](compiler/parser-functions.md)
  * [Binder](compiler/binder.md)
    * [Binder Functions](compiler/binder-functions.md)
    * [Binder Declarations](compiler/binder-declarations.md)
    * [Binder Container](compiler/binder-container.md)
    * [Binder SymbolTable](compiler/binder-symboltable.md)
    * [Binder Error Reporting](compiler/binder-diagnostics.md)
  * [Checker](compiler/checker.md)
    * [Checker Diagnostics](compiler/checker-global.md)
    * [Checker Error Reporting](compiler/checker-diagnostics.md)
  * [Emitter](compiler/emitter.md)
    * [Emitter Functions](compiler/emitter-functions.md)
    * [Emitter SourceMaps](compiler/emitter-sourcemaps.md)
  * [Contributing](compiler/contributing.md)