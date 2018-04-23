const router = require('koa-router')();

const yandexAuth = require('./utils/yandex-api');

// http://localhost:3010/api/yandex-auth?redirect_url=http://localhost:3010/receive-code
router.get('/api/yandex-auth', async (ctx) => {
  const redirectUrl = ctx.query.redirect_url;
  ctx.redirect(yandexAuth.generateAuthUrl({ redirectUrl }));
});

router.get('/api/get-yandex-token', async (ctx) => {
  const code = ctx.query.code;
  const refreshToken = ctx.query.refresh_token;

  const tokenResponse = await yandexAuth.getToken({ code, refreshToken });

  ctx.status = 200;
  ctx.body = {
    repsponse: tokenResponse
  };
});

module.exports = router;
