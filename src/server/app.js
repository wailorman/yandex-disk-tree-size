require('dotenv').config();

const Koa = require('koa');
const session = require('koa-session');
const cors = require('@koa/cors');

const routes = require('./routes');
const redisStore = require('./redis-store');

const app = new Koa();

app.keys = ['some secret hurr'];

const PORT = process.env.PORT || 3000;
const DEFAULT_YANDEX_TOKEN_AGE = 31536000 * 1000;

const CONFIG = {
  key: 'koa:sesddds',
  maxAge: DEFAULT_YANDEX_TOKEN_AGE,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
  store: redisStore,
};

app.use(async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    ctx.body = {
      error: err.message,
    };
    return ctx.body;
  }
});

app.use(session(CONFIG, app));
app.use(
  cors({
    credentials: true,
  }),
);

app.use(routes.routes());

(async () => {
  app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log('Server started on port', PORT);
})().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
