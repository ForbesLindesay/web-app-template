import http from 'http';

http
  .createServer((_req, res) => {
    res.end('Hello Forbes');
  })
  .listen(process.env.PORT || 3000);
