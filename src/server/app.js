require('dotenv').config();

const Koa = require('koa');
const session = require('koa-session');

const routes = require('./routes');
const redisStore = require('./redis-store');

const app = new Koa();

app.keys = ['some secret hurr'];

const PORT = process.env.PORT || 3000;
const DEFAULT_YANDEX_TOKEN_AGE = 31536000 * 1000;

const CONFIG = {
  key: 'koa:sesddds' /** (string) cookie key (default is koa:sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: DEFAULT_YANDEX_TOKEN_AGE,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
  store: redisStore
};

app.use(async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    console.error(err);
    return ctx.body = {
      error: err.message
    };
  }
});

app.use(session(CONFIG, app));

app.use(routes.routes());

(async () => {
  app.listen(PORT);
  console.log('Server started on port', PORT);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
