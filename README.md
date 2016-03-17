# set-asap

async variable call control

A replacement for your `setImmediate` calls.

## Installation

```
npm install --save set-asap
```

## API

### setAsap( fn: function [, maxTime: number[, minTime: number ]]) => id: number

* `fn` - function you want to execute
* `maxTime` - the maximum time you need it to be executed. ( Defaults to: 500 )
* `minTime` - the minimum time you need it to be executed. ( Defaults to: 0 )

### clearAsap( id ) => bool

* `id` - id returned by `setAsap`

## Usage example

### es6
```js
import { setAsap, clearAsap } from 'set-asap'

function doSomethingHeavy () {
  for ( var i = 0; i < 3000000; i++ ) {}
}

for ( var i = 0; i < 300; i++ ) {
  setAsap( doSomethingHeavy )
}
```

### es5
```js
var setAsap = require( 'set-asap' )
var clearAsap = setAsap.clearAsap

function doSomethingHeavy () {
  for ( var i = 0; i < 3000000; i++ ) {}
}

for ( var i = 0; i < 300; i++ ) {
  setAsap( doSomethingHeavy )
}
```

## FAQ

### What is this?

This module provides a timer method for running variable async calls.

### What is a timer method?

Timer async methods are the API methods which interact with the **next ticking stack**.
Examples:
- `setImmediate`
- `setTimeout`
- `setInterval`

### Why did you bring this up?

**Javascript** doesn't always have great performance on all engines, thats a fact,
specially on browsers where they have to update the UI on the same JS process.

Besides, **Javascript** is meant to be non-blocking IO driven but if you fill
up the next tick stack it will act as IO blocking.

### Wait, why does that happen?

Under the hood, timer async methods just place up the function provided by the
developer at the end of an array.

When the engine has nothing to do, it just picks up the first one that is
eligible to run and starts its execution, if that execution or more of them calls
up more, you will end up filling the next stack, resulting in a blocking IO.

### And whats bad on filling up the next stack?

#### On Node.JS
If you fill up your **next tick stack** and it is serving an HTTP service, the
server will take longer to start handling new requests, because it uses the
that stack.

#### Browser
Browsers use Javascript to handle UI redrawing, which means that if you block
the engine, the UI will crash while handling all the ticking calls you got on.

### Can you give me an example on how to block the engine?

#### sync
```js
while ( 1 ) {}
```

#### async
```js
(function runMySelf () {
  setInterval( runMySelf, 4 )
})()
```

### How does this fixes this issue?

You won't block the IO, you don't want to, but it could happen whenever your
code has lot of things to handle, this method is a mixture between the
`setImmediate` and `setInterval`, but instead of a fixed timing, it places your
call in a dynamic window without respecting priority.

This method allows the engine to handle other resources on the spare time.

### Could you please represent it on a graphical way?

If you meant terminal graphicall way, yes.


#### Legend:
* `-` - spare time
* `[number]` - execution
* `[char]` - each character means a tick

Imagine a case where I want to fill 8 executions on the next second:

#### Case with `setImmediate`

```
12345678----------------------
```

#### Case with `setAsap`

```
---71--4--5-----9-6---2--3--8-
```
