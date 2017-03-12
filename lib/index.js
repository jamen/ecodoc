var level = require('level')
var pull = require('pull-stream')
var fetch = require('pull-fetch')
var atob = require('atob')
var path = require('path')
var createRead = require('./read')

module.exports = ecodoc

function ecodoc (opts) {
  opts = Object.assign({ token: process.env.GH_TOKEN }, opts)

  if (!opts.cache) {
    return function (_, done) {
      done(new Error('Expected cache path, got ' + opts.cache))
    }
  }

  var db = level(opts.cache, { valueEncoding: 'json' })
  var read = createRead(opts, db)

  return function docs (repos, done) {
    if (!Array.isArray(repos)) {
      return pull(
        pull.values(Object.keys(repos)),
        pull.asyncMap((group, done) => {
          docs(repos[group], (err, info) => {
            if (err) return done(err)
            info.group = group
            done(null, info)
          })
        }),
        pull.flatten(),
        pull.collect(done)
      )
    }

    var mapOutput = opts.map ? pull.map(opts.map) : pull.through()

    return pull(
      pull.values(repos),
      pull.asyncMap(read),
      mapOutput,
      pull.collect(done)
    )
  }
}
