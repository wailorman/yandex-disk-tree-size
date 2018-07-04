const router = require('koa-router')();

const yandexApi = require('./utils/yandex-api');

// http://localhost:3010/api/yandex-auth?redirect_url=http://localhost:3010/receive-code
router.get('/api/yandex/auth', async (ctx) => {
  ctx.session.authRedirectUrl = ctx.query.redirect_url || '/';
  ctx.redirect(
    yandexApi.generateAuthUrl({
      redirectUrl: `${process.env.APP_URL}/api/yandex/receive-code`,
    }),
  );
});

router.get('/api/yandex/receive-code', async (ctx) => {
  const tokenResponse = await yandexApi.getToken({ code: ctx.query.code });

  ctx.session.accessToken = tokenResponse.access_token;
  ctx.session.refreshToken = tokenResponse.refresh_token;
  ctx.session.tokenDueTo = new Date(new Date().getTime() + tokenResponse.expires_in * 1000);
  ctx.redirect(ctx.session.authRedirectUrl);
});

router.get('/api/yandex/resource', async (ctx) => {
  const { path } = ctx.query;
  const { accessToken } = ctx.session;

  if (!accessToken) {
    throw new Error('Missing accessToken');
  }

  const res = await yandexApi.getResourceInfo({ path }, { accessToken });

  ctx.status = 200;
  ctx.body = {
    response: res,
  };
});

router.get('/api/ping', async (ctx) => {
  ctx.status = 200;
  ctx.body = 'OK';
});

router.get('/api/is-authenticated', async (ctx) => {
  ctx.body = {
    response: !!ctx.session.accessToken,
  };
});

module.exports = router;
