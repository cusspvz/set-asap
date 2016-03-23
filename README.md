# set-asap

[![npm version](https://badge.fury.io/js/set-asap.svg)](https://badge.fury.io/js/set-asap)

async variable call control

A replacement for your `setImmediate` / `setTimeout` calls.

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

### Why did you brought this up?

**Javascript** doesn't always have great performance on all engines, thats a fact.
(V8 Rockkkssss, hell yeah)
Specially on browsers, since they have to share the same JS process with the DOM
rendering/draw.

Besides, **Javascript** is meant to be non-blocking IO driven but if you fill
up the next tick stack it will act as IO blocking.

### Wait, why does that happen?

Under the hood, timer async methods just place up the function provided by the
developer at the end of an array.

When the engine has nothing to do, it just picks up the first one that is
eligible to run and starts its execution, thats also why `setTimeout` and
`setInterval` calls doesn't have 100% time accuracy.

If the current execution or the others holding on stack are meant to call up
more, you will ending up filling the next tick stack, resulting in a blocking
IO scenario.

### And whats bad on filling up the next tick stack?

#### On Node.JS
If you fill up your **next tick stack** and it is serving an HTTP service, the
server will take longer to start handling new requests, because it uses the
the same timer methods.

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

<img src="http://g.recordit.co/P88YayHz01.gif" />


### How does this fixes this issue?

You won't block the IO, you don't want to, but it could happen whenever your
code has lot of things to handle, this method is a mixture between the
`setImmediate` and `setTimeout`, but instead of a fixed timing, it places your
call in a dynamic window without respecting priority.

This method allows the engine to handle other resources on the spare time.

### Could you please represent it on a graphical way?

If you meant terminal way, yes. =D


#### Legend:
* `-` - spare time
* `[number]` - execution
* `[char]` - each character means a tick

Imagine a case where I want to fill 9 executions on the next second:

#### Case with `setImmediate`

```js
for ( var i = 1; i <= 9; i++ ) {
  setImmediate( () => null )
}
```

```
123456789---------------------
```

#### Case with `setTimeout`

```js
for ( var i = 1; i <= 9; i++ ) {
  setTimeout( () => null, 500 )
}
```

```
--------------123456789------
```

#### Case with `setAsap`

```js
for ( var i = 1; i <= 9; i++ ) {
  setAsap( () => null, 1000, 50 )
}
```

```
---71--4--5-----9-6---2--3--8-
```

## License

Available throught the GPL-3.0 LICENSE.
Copyright (C) 2016 - [José Moreira](https://github.com/cusspvz)
