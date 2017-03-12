var pull = require('pull-stream')
var fetch = require('pull-fetch')
var drain = pull.drain

module.exports = function (repo, token, done) {
  pull(
    fetch.json('https://api.github.com/repos/' + repo + '/git/refs', {
      headers: {
        'User-Agent': 'ecodoc checking refs',
        'Authorization': 'token ' + token
      }
    }),
    drain(function (refs) {
      done(!refs || !refs[0] || !refs[0].object ? null : refs[0].object.sha)
    })
  )
}
