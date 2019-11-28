import http from 'http';

http
  .createServer((_req, res) => {
    res.end('Configured!');
  })
  .listen(process.env.PORT || 3000);
