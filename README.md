backup-gists
======================
Backup gists for both github.com and github enterprise.


## Installation

_need node > 5.0_ https://github.com/creationix/nvm

```
npm i
```

## Quick Start

For github.com user, the following command will generate a `backup-hh-mm-ss` folder in current directory.
```
➜ node index.js -u [username] -p [password]
➜ Backup [====================] 100%
```


####  Github Enterprise version
For github enterprise version, append `-d / --domain` option to add your github enterprise domain's host. Let's say, your domain is `http://github.o-in.bbc.com/` , just append `-d github.o-in.bbc.com`.
```
➜ node index.js -u [username] -p [password] -d [github_enterprise_domain]
➜ Backup [====================] 100%
```

## License

MIT
