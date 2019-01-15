
# Simple Map Cache

This module a very simple key/value storage for node, so you can cache any operation, function or call results.

This used to be part of my module [simple-fetch-cache](https://www.npmjs.com/package/simple-fetch-cache), but I decided to extract it and publish it on its own. It doesn't have any external dependencies and it uses the native `Map` object to track the entries.

## Install

You can install with [npm]:

```sh
$ npm install --save simple-map-cache
```

## Usage

Please look at the index.test.js file to check how the module can be used, but in a nutshell these are the methods available:

`set,
get,
del,
clear`

| Parameter     | Description   |
| ------------- |:-------------:|
| set         | Add new entry to the cache. ie `set('day', 'friday')` |
| get      | Retrieves entry from the cache. `get('day') // returns friday. undefined for the non existing values.` |
| del | Removes entry from the cache |
| clear | Wipes out all the entries from the cache |

#### Time to live (TTL)

All the requests cached in memory will persist there as long as the process in running. Nevertheless if you require the cache to expire after X miliseconds, you can pass it as a second parameter. ie:

```js
// It will disappear after 100 msec.
> const cache = require('simple-map-cache')
> cache.set('testephimeral', 'shouldberemovedsoon', 100)

```

### License

Copyright © 2019, [Juan Convers](https://github.com/webdacjs).
Released under the [MIT License](LICENSE).
