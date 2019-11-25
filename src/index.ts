import http from 'http';

http
  .createServer((_req, res) => {
    res.end('Hello Kubernetes');
  })
  .listen(process.env.PORT || 3000);
