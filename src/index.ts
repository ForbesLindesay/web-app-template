import http from 'http';

http
  .createServer((_req, res) => {
    res.end('Wait for it...');
  })
  .listen(process.env.PORT || 3000);
