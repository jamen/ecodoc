var pull = require('pull-stream')
var fetch = require('pull-fetch')
var getRef = require('./get-ref')
var createSync = require('./sync')

module.exports = function (opts, db) {
  var sync = createSync(opts, db)
  return function read (repo, done) {
    db.get(repo, function (err, data) {
      if (err && err.notFound) return sync(repo, null, done)
      if (err) return done(err)

      // Check data is up to date:
      getRef(data.repo, opts.token, function (ref) {
        if (ref !== null && ref === data.latest_ref) {
          done(null, data)
        } else {
          sync(repo, ref, done)
        }
      })
    })
  }
}
