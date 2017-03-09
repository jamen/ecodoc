
# ecodoc

> Manage docs across multiple packages

Ecodoc takes an array of GitHub projects, and gives you back their info + their readmes.  It caches the requests using leveldb and works good with [`pull-stream`](https://github.com/pull-stream/pull-stream).

```js
var docs = ecodoc({ data: __dirname + '/cache' })

docs([
  'audiojs/audio',
  'audiojs/audio-buffer',
  'audiojs/audio-speaker',
  // ...
], function (err, pkgs) {
  // Use resulting `pkgs`
})
```

This is inspired by [`ecosystem-docs`](https://www.npmjs.com/package/ecosystem-docs), to take a more simple approach.

## Installation

```sh
$ npm install --save ecodoc
```

## Usage

### `ecodoc(opts)`

Create the ecodoc cache and returns the `docs` function.

 - `opts.data` (`String`): Path to where the cache is stored.

```js
var docs = ecodocs({
  data: __dirname + '/cache'
})

// ...
```

### `docs(names, done)`

Fetch the info & readmes from the array of names.

 - `names` (`Array`): GitHub repository names, e.g. `audiojs/audio`.
 - `done` (`Function`): Completion callback with `(err, pkgs)`.

```js
docs([
  'audiojs/audio',
  'audiojs/audio-buffer',
  // ...
], function (err, pkgs) {
  console.log(pkgs)
})
```

## License

MIT © [Jamen Marz](https://git.io/jamen)

---

[![version](https://img.shields.io/npm/v/ecodoc.svg?style=flat-square)][package] [![travis](https://img.shields.io/travis/ecodoc/jamen.svg?style=flat-square)](https://travis-ci.org/ecodoc/jamen) [![downloads/month](https://img.shields.io/npm/dm/ecodoc.svg?style=flat-square)][package] [![downloads](https://img.shields.io/npm/dt/ecodoc.svg?style=flat-square)][package] [![license](https://img.shields.io/npm/l/ecodoc.svg?style=flat-square)][package] [![support me](https://img.shields.io/badge/support%20me-paypal-green.svg?style=flat-square)](https://www.paypal.me/jamenmarz/5usd) [![follow](https://img.shields.io/github/followers/jamen.svg?style=social&label=Follow)](https://github.com/jamen)
[package]: https://npmjs.com/package/ecodoc
