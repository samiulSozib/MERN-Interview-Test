const drawingRoute=require('./drawingRoute')
const routes = [
    // {
    //     path:'/drawings',
    //     handler:drawingRoute
    // },
    {
        path: '/',
        handler: drawingRoute
    },
   
]

module.exports = (app) => {
    routes.forEach(r => {
        if (r.path == '/') {
            app.use(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}