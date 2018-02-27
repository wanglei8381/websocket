import Router from 'koa-router'
const router = new Router()

router.get('/', cxt => {
  return cxt.render('index', {
    title: 'API'
  })
})

export default router
