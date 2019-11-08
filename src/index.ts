import http from 'http';

http
  .createServer((_req, res) => {
    res.end('Hello dokku-ci-user');
  })
  .listen(process.env.PORT || 3000);
