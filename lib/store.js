const request = require('superagent')

const hubUrl = 'https://hub.docker.com/v2'
const repoUrl = (repoName) => hubUrl + '/repositories/' + repoName

// TODO this should be retrieved elsewhere (say, github?)
let repoList = [
  {
    name: 'library/owncloud'
  },
  {
    name: 'library/jenkins'
  },
  {
    name: 'library/redis'
  }
]


function requestTag(url) {

  return new Promise((resolve, reject) => {
    
    request.get(url)
      .set('Accpt', 'application/json')
      .end((err, res) => {
        if (err) resolve(err)
        else if (!res.ok) resolve(new Error('Bad Response'))
        else resolve(res.body)
      })
  })
}

/** TODO too much! **/
async function requestAllTags(name) {

  let url = repoUrl(name) + '/tags'
  let all = []

  while (true) {

    console.log(url)    
    let r = await requestTag(url)
    if (r instanceof Error) {
      console.log(r)
      return r
    }

    all = [...all, ...r.results]
    if (r.next === null)
      return all

    url = r.next
  }
}


/* this promise never reject */
async function requestRepo(name) {

  let repo =  new Promise((resolve, reject) => {

    request.get(repoUrl(name))
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) resolve(err)
        else if (!res.ok) resovle(new Error('Bad Response'))
        else resolve(res.body)
      })
  }) 

  let r = await Promise.all([repo, requestAllTags(name)])
  if (r[0] instanceof Error || r[1] instanceof Error)
    return new Error('Bad Response')

  return Object.assign(r[0], { tags: r[1]})
}


async function requestAllRepos() {

  console.log('requesting repo list')
  let responses = await Promise.all(repoList.map(repo => requestRepo(repo.name)))
  console.log('requesting repo list end')
  return responses.filter(res => (!(res instanceof Error)))
}

module.exports = (callback) => {

  requestAllRepos()
    .then(r => {
      callback(null, r)
    })
    .catch(e => {
      console.log(e)
      callback(null, [])
    })
}
