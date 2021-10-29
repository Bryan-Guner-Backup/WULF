# ThrowLog

_When you just want to throw some logging into the CLI_

----

Install with yarn or npm

    yarn add throwlog
    
    npm -i throwlog
    
Normal usage:

    import {dump, info, success, warn, error, kill} from 'throwlog';

- `info`, `success`, `warn`, `error` will print a string in a colorfull box to stdout

- `dump` will take any data structure and print it nicely to stderr

- `kill` will halt the program after dumping first parameter and error'ing the second parameter (if any). Both to stderr

----


**Examples**

```js
let email = process.env.EMAIL || kill('Please set EMAIL')
```

```js
info('About to fix things')
let data = fixThings()
success('Things fixed')
dump(data)
```
    