# tapetown [![Build Status](https://travis-ci.org/mathiasrw/tapetown.svg?branch=master)](https://travis-ci.org/mathiasrw/tapetown)

_Where all the TAP related testing is hanging out_

Growing the idea of (the awesome) [tape](https://github.com/substack/tape) via [tape-catch](https://github.com/michaelrhodes/tape-catch) aiming for a "batteries included" alternative to mocha.
If you, like I did, feel repelled by the idea of walking away from mocha for testing then have a look at the blogpost "[Why I use Tape Instead of Mocha & So Should You](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)"




## install

```sh
$ npm install tapetown --save-dev
```


## example
```js
var test = require('tapetown')

test('cause an exception', function (t) {
  t.ok(myUnknownVar === 123, 'this will throw exception')
  t.end();
})

test('still run this test', function (t) {
  t.ok(1 + 1 === 2, 'this still ran')
  t.end() 
})
```

```
TAP version 13
# cause an exception
not ok 1 ReferenceError: myUnknownVar is not defined
  ---
    operator: error
    expected: undefined
    actual:   {}
    stack:
      ReferenceError: asdf is not defined
        at Test.<anonymous> (/path/to/example.js:4:3)
        at Test.bound [as _cb] (/path/to/node_modules/tape/lib/test.js:59:32)
        at Test.exports.Test.run (/path/to/index.js:17:10)
        at Test.bound [as run] (/path/to/node_modules/tape/lib/test.js:59:32)
        at Object.next [as _onImmediate] (/path/to/node_modules/tape/lib/results.js:66:15)
        at processImmediate [as _immediateCallback] (timers.js:345:15)
  ...
# still run this test
ok 2 this still ran

1..2
# tests 2
# pass  1
# fail  1
```

## license
[MIT](http://opensource.org/licenses/MIT)
