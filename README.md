# web-app-template

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/web-app-template.svg)](https://greenkeeper.io/)

A template for a node app using TypeScript deployed to dokku

## Setting up Dokku

Set up https://marketplace.digitalocean.com/apps/dokku and make sure you add the SSH key that's in `~/.ssh/id_rsa.pub`.

Add the following to `~/.ssh/config` (using the correct IP):
```
Host dokku
  HostName IP_ADDRESS_OF_DOKKU_SERVER
  User root
```

## Setting up the repo

1. Hit "Use This Template" to create the repository
1. Enable [CircleCI](https://circleci.com/add-projects/gh/ForbesLindesay)
1. Enable [semantic-pull-requests](https://github.com/apps/semantic-pull-requests)
1. In Settings
   1. Disable "Wikis"
   1. Disable "Projects"
   1. Disable "Allow merge commits"
   1. Disable "Allow rebase merging"
   1. Enable "Automatically delete head branches"
1. Create a new branch
1. Commit initial code to the branch (be sure to replace all refernces to web-app-template, and remove these instructions from the README)
1. Push the new branch and create a PR
1. In Settings -> Branch Protection, create a new rule
   1. Use "master" as the branch name pattern
   1. Enable "Require status checks to pass before merging"
   1. Select the unit tests as required
   1. Enable "Include administrators"
   1. Enable "Restrict who can push to matching branches"
1. Merge the PR

## Setting up a new app

1. ssh into the dokku server `ssh dokku`
1. create the app `dokku apps:create web-app-template`
1. enable zero downtime deploys `dokku checks:enable web-app-template` - N.B. this will result in 2 coppies of each app running in parallel during deploys

## Deploying locally

See [Dokku - Docker Image Tag Deployment](http://dokku.viewdocs.io/dokku/deployment/methods/images/)

1. build the typescript etc. `yarn build`
1. build an initial image `docker build -t dokku/web-app-template:v0 .`
1. push `docker save dokku/web-app-template:0 | bzip2 | pv | ssh dokku "bunzip2 | docker load"` (you can get the total number of bytes that will need to be transferred by running `docker save dokku/web-app-template:0 | bzip2 | wc -c`)
1. deploy `ssh dokku "dokku tags:deploy web-app-template 0"`

## Setting up Circle CI

After you follow the instructions for "Setting up a new app". You can configure CI to deploy your app.

1. Generate a key to use for deployment: `ssh-keygen -m PEM -t rsa -C web-app-template -f key` **N.B. do not enter a pass phrase when prompted, Circle CI cannot decrypt ssh keys protected by pass phrases.**.
1. Go to Circle CI -> web-app-template -> Settings -> SSH Permissions (https://circleci.com/gh/ForbesLindesay/web-app-template/edit#ssh)
1. Put the copy of the `key` file into a new SSH key and leave the hostname blank
1. Copy the "Fingerprint" into ".circleci/config.yml" in place of the fingerprint that is currently there.
1. `cat key.pub | ssh dokku "dokku ssh-keys:add web-app-template"`.
1. Set the `DOKKU_SERVER` env var to the IP address of your dokku server in Circle CI.

## Enabling HTTPS

See [Effortlessly add HTTPS to Dokku, with Let’s Encrypt](https://medium.com/@pimterry/effortlessly-add-https-to-dokku-with-lets-encrypt-900696366890)

1. ssh into the dokku server `ssh dokku`
1. Update letsencrypt plugin `dokku plugin:update letsencrypt`
1. Set email for app `dokku config:set --no-restart web-app-template DOKKU_LETSENCRYPT_EMAIL=YOUR_EMAIL_ADDRESS_HERE`
1. Enable letsencrypt `dokku letsencrypt web-app-template`

(one off for the server, also run `dokku letsencrypt:cron-job --add`)
