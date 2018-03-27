const Koa=require("koa")
const Router=require("koa-router")
const bodyParser=require("koa-bodyparser")
const app=new Koa()
const router=new Router()
app.use(bodyParser())
var pos=1
var tasks=[
    {
        task: "ganhar dinheiro",
        completed: true,
        order: 1
    }
]
router.get("/", (ctx, name) => {
    ctx.body="Task List"
})
router.get("/tasks", (ctx, next) => {
    ctx.body=tasks
})
router.get("/tasks/:id", (ctx, next) => {
    const id=ctx.params.id
    if (tasks[id-1]){
        ctx.body=tasks[id-1]
    }else if(id==="completed"){
        var arr=[]
        for (var i=0;i<tasks.length;i++){
            if (tasks[i].completed){
                arr.push(tasks[i])
            }
        }
        ctx.body=arr
    }else if(id==="active"){
        var arr2=[]
        for (var i=0;i<tasks.length;i++){
            if (!tasks[i].completed){
                arr2.push(tasks[i])
            }
        }
        ctx.body=arr2
    }else{
        ctx.body="Not found"
        ctx.status=404
    }
})
router.post("/tasks", (ctx, next) => {
    var newTask=ctx.request.body
    tasks.push(newTask)
    ctx.body=tasks[pos]
    pos++
    ctx.status=201
})
router.put("/tasks/:id", (ctx, next) => {
    var id=ctx.params.id, aux
    if (tasks[id-1]){
        Object.assign(tasks[id-1], ctx.request.body)
        if (ctx.request.body.order!==id){
            aux=tasks[ctx.request.body.order-1]
            tasks[ctx.request.body.order-1]=tasks[id-1]
            tasks[id-1]=aux
            tasks[id-1].order=id
            ctx.body=tasks[ctx.request.body.order-1]
        }else{
            ctx.body=tasks[id-1]
        }
    }else{
        ctx.body="Not found"
        ctx.status=404
    }
})
router.delete("/tasks/:id", (ctx, next) => {
    var id=ctx.params.id
    if (tasks[id-1]){
        var counter=1
        tasks.splice(id-1, 1)
        for (var i=0;i<tasks.length;i++){
            tasks[i].order=counter
            counter++
        }
        ctx.body=""
        ctx.status=204
    }else if (id==="completed"){
        var counter2=1
        for (var i=0;i<tasks.length;i++){
            if (tasks[i].completed){
                tasks.splice(i, 1)
                i--
            }
        }
        for (var i=0;i<tasks.length;i++){
            tasks[i].order=counter2
            counter2++
        }
        ctx.body=""
        ctx.status=204
    }else{
        ctx.body="Not found"
        ctx.status=404
    }
})
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)