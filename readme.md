
# ecodoc

> Manage docs across multiple packages

Ecodoc maps an array of GitHub repository names to their info, contributors, latest version, and readme.

## Install

```sh
npm install --save ecodoc
```

## Usage

**Note:** In order for this to work, you need to set `GH_TOKEN` environment variable, or pass in `opts.token`.  Otherwise, GitHub rate limits to 60 requests per hour.  This tool makes at least 1 request per repository to check if info is updated.  It makes 4 more requests for the info, contributors, tags, and README.

If you are lazy, you can just put `GH_TOKEN=...` in front of a command that runs `ecodoc`:

```sh
GH_TOKEN=... npm run build
```

### `ecodoc(opts)`

Create an ecodoc mapping function (called [`docs`](#api_docs)) with some options

 - `cache` (`String`): Path to where to store leveldb cache. **Required**
 - `token` (`String`): GitHub API Token. Defaults to `GH_TOKEN` env var. **Required**
 - `cacheMap` (`Function`): Map each project right before you cache it.
 - `map` (`Function`): Map all project info before you receive it.

```js
var docs = ecodoc({
  cache: __dirname + '/cache',
  token: ..., // GH token, or just use `GH_TOKEN`
})
```

### `docs(projects, done)`

Map project names to their info, latest version, contributors, and readme.  They come from either requests or leveldb cache.

You can provide `projects` as an array of GitHub repos, as an object in groups of arrays.

```js
docs([
  'audiojs/audio',
  'audiojs/audio-buffer'
], function (err, projects) {
  console.log(projects)
  // [ { repo: 'audiojs/audio', latest_version: 'v1.2.0' ... }
  //   { repo: 'audiojs/audio-buffer', latest_version: 'v1.0.0' ... } ]
})
```

Or in groups:

```js
docs({
  core: [
    'audiojs/audio',
    'audiojs/audio-buffer'
  ],
  utility: [
    'audiojs/is-audio-buffer'
  ]
}, function (err, projects) {
  console.log(projects)
  // [ { name: 'audio', group: 'core', ... },
  //   { name: 'audio-buffer', group: 'core' },
  //   { name: 'is-audio-buffer', group: 'utility' } ]
})
```

### `project`

This object contains:

```js
{
  name: 'audio',            // project name
  repo: 'audiojs/audio',    // project repo
  desc: '...',              // project description
  group: 'core',            // project group (or falsy)
  latest_version: 'v1.2.0', // latest git tag version
  latest_ref: ...,          // latest git ref
  readme: ...,              // README contents base64 encoded
  contributors: [
    {
      username: 'dfcreative',                    // contributor username
      profile: 'https://github.com/dfcreative',  // contributor profile
      avatar: ...,                               // contributor avatar
      id: 300067,                                // contributor id
      contributions: 4                           // contributions
    }
    // ...
  ]
}
```

## License

MIT © [Jamen Marz](https://git.io/jamen)

---

[![version](https://img.shields.io/npm/v/ecodoc.svg?style=flat-square)][package] [![travis](https://img.shields.io/travis/ecodoc/jamen.svg?style=flat-square)](https://travis-ci.org/ecodoc/jamen) [![downloads/month](https://img.shields.io/npm/dm/ecodoc.svg?style=flat-square)][package] [![downloads](https://img.shields.io/npm/dt/ecodoc.svg?style=flat-square)][package] [![license](https://img.shields.io/npm/l/ecodoc.svg?style=flat-square)][package] [![support me](https://img.shields.io/badge/support%20me-paypal-green.svg?style=flat-square)](https://www.paypal.me/jamenmarz/5usd) [![follow](https://img.shields.io/github/followers/jamen.svg?style=social&label=Follow)](https://github.com/jamen)
[package]: https://npmjs.com/package/ecodoc
