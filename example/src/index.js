import Koa from 'koa'
import views from 'koa-views'
import statics from 'koa-static'
import WebSocketServer from './server'
import router from './router'

const app = new Koa()
const server = new WebSocketServer(app.callback())

app.use(
  views(__dirname + '/views', { extension: 'hbs', map: { hbs: 'handlebars' } })
)

app.use(statics(__dirname + '/public'))

app.use(router.routes()).use(router.allowedMethods())

server.start(function () {
  console.log('Server启动了，打开地址 http://127.0.0.1:' + server.port)
})
