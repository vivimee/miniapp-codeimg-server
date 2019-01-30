const fs = require('fs');
const Koa = require('koa');
const Koabody = require('koa-body');
const cors = require("koa2-cors");
const Router = require('koa-router');
const KoaStatic = require('koa-static');
const imgService = require('./imgService');

const app = new Koa();
const router = new Router();
const html = fs.readFileSync('./index.html');

router.get('/', async(ctx, next) => {
    await next();
    ctx.type = 'html';
    ctx.body = html;
});

router.post('/api/process', Koabody(), async(ctx, next) => {
    await next();
    const options = ctx.request.body;
    const res = await imgService(options);
    ctx.body = JSON.stringify(res);
});

app.use(KoaStatic('./imgs'));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(cors());
app.listen(8800);
