import http from 'http';

http
  .createServer((req, res) => {
    console.info(
      JSON.stringify({
        method: req.method,
        url: req.url,
        status: 200,
        duration: Math.floor(Math.random() * 100),
      }),
    );
    res.end(process.env.ENV_VAR);
  })
  .listen(process.env.PORT || 3000);
