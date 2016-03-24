const r = require('request')
const conf = require('commander')
const pkg = require('./package')
const cp = require('child_process')
const fs = require('fs')
const path = require('path')
const progress = require('progress')
const sleep = require('sleep')
const chalk = require('chalk')

conf
  .version(pkg.version)
  .option('-u, --username <username>', 'github username')
  .option('-p, --password <password>', 'github password')
  .option('-d, --domain <domain>'    , 'github host')
  .parse(process.argv)

r.get({
  url: conf.domain
  ? `http://${conf.username}:${conf.password}@${conf.domain}/api/v3/users/${conf.username}/gists`
  : `https://${conf.username}:${conf.password}@api.github.com/users/${conf.username}/gists`,
  json: true,
  headers: {
    'User-Agent': 'backup-gists',
    'Accept': 'application/vnd.github.v3+json'
  }
}, (err, res, body) => {

  if (err || res.statusCode !== 200) {
    throw new Error(`
      Failed:
        err: ${err},
        status: ${res && res.statusCode}
        body: ${body}
    `)
  }

  // try make backup dir
  const BACKUP_DIR = `backup-${(new Date()).toString().split(' ')[4].replace(/:/g, '-')}`
  try {
    fs.mkdirSync(BACKUP_DIR)
  } catch (e) {
    if (e.code !== 'EEXIST') throw new Error(`mkdir ${BACKUP_DIR} failed: ${e}`)
  }

  if(! body instanceof Array) {
    throw new TypeError(`unexpected body format: ${typeof body}`)
  }

  const pg = new progress(chalk.green('Backup [:bar] :percent'), {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: body.length
  })
  pg.tick()

  body.forEach( (gist, idx) => {
    sleep.sleep(1)
    cp.exec(`git clone ${gist.git_pull_url}`, {
      cwd: path.join(__dirname, BACKUP_DIR)
    }, (err, stdout, stderr) => {
      if(err) {
        console.error(chalk.red(`clone  ${gist.git_pull_url} failed: ${err || stderr}`))
      }
    })
    pg.tick()
  })

})
