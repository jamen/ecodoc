var level = require('level')
var pull = require('pull-stream')
var fetch = require('pull-fetch')
var atob = require('atob')

module.exports = ecodoc

function ecodoc (opts) {
  opts = opts || {}
  var db = level(opts.data)

  return function fetch (names, done) {
    pull(
      pull.values(names),
      pull.asyncMap(package),
      pull.collect(done)
    )
  }

  function package (name, done) {
    db.get(name, function (err, info) {
      if (!err) return done(null, JSON.parse(info))
      if (err && !err.notFound) return done(err)
      pull(
        fetch.json('https://api.github.com/repos/' + name, {
          headers: { 'User-Agent': 'ecodoc' }
        }),
        pull.asyncMap(function (info, done) {
          if (info.message && info.message === 'Not Found') {
            return done(new Error('package ' + name + ' not found'))
          }
          pull(
            fetch.json('https://api.github.com/repos/' + name + '/readme', {
              headers: { 'User-Agent': 'ecodoc' }
            }),
            pull.map(x => atob(x.content)),
            pull.collect(function (err, readme) {
              done(err, err ? null : {
                name: info.full_name,
                link: info.html_url,
                stars: info.stargazers_count,
                readme: readme[0]
              })
            })
          )
        }),
        pull.collect(function (err, data) {
          data = data[0]
          if (err) return done(err)
          db.put(name, JSON.stringify(data), function (err) {
            done(err, err ? null : data)
          })
        })
      )
    })
  }
}
