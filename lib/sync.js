var pull = require('pull-stream')
var fetch = require('pull-fetch')
var paramap = require('pull-paramap')
var semver = require('semver')
var getRef = require('./get-ref')
function thru (a) { return a }

// 1. The repo data exists locally
// 2. It is up to date with origin
module.exports = function (opts, db) {
  return function (repo, ref, done) {
    if (ref) write(repo, ref, db, opts.token, opts.cacheMap, done)
    else getRef(repo, opts.token, function (ref) {
      write(repo, ref, db, opts.token, opts.cacheMap, done)
    })
  }
}

function write (repo, ref, db, token, cacheMap, done) {
  var api_repo = 'https://api.github.com/repos/' + repo
  var api_header = { headers: {
    'User-Agent': 'ecodoc',
    'Authorization': 'token ' + token
  } }
  pull(
    pull.values([
      api_repo,
      api_repo + '/contributors',
      api_repo + '/tags',
      api_repo + '/readme'
    ]),
    paramap(function (link, next) {
      pull(
        fetch.json(link, api_header),
        pull.collect(function (err, data) {
          next(err, err ? null : data[0])
        })
      )
    }),
    pull.collect(function (err, responses) {
      var info = responses[0]
      // console.log(info)
      var contributors = responses[1]
      var latest = latest_stable(responses[2])
      var readme = responses[0]
      // console.log(info, contributors, latest)
      var item = {
        repo: info.full_name,
        name: info.name,
        desc: info.description,
        latest_version: latest,
        latest_ref: ref,
        homepage: info.homepage,
        readme: readme,
        contributors: contributors.map(function (contrib) {
          return {
            username: contrib.login,
            profile: contrib.html_url,
            avatar: contrib.avatar_url,
            id: contrib.id,
            contributions: contrib.contributions
          }
        })
      }
      db.put(repo, item, function (err) {
        if (err) return done(err)
        done(null, cacheMap ? cacheMap(item) : item)
      })
    })
  )
}

function latest_stable (tags) {
  for (var i = 0, max = tags.length; i < max; i++) {
    var tag = tags[i].name
    if (!semver.prerelease(tag)) {
      return tag
    }
  }
  return null
}
