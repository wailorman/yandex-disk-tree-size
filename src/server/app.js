const Koa = require('koa');
const db = require('../../models');

const routes = require('./routes');

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(routes.routes());

(async () => {
  try {
    await db.sequelize.sync({ force: true })

    app.listen(PORT);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})(); 
