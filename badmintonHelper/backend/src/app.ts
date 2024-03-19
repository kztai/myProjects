import express from "express";
import bodyParser from "body-parser";
import "module-alias/register";  // 路径别名

import registerRouter from "./router/index";
import { dbConnect } from "./db/db.index";
import { initTable } from "./models/index";

const app = express();

// 1、加载中间件：
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // 对URL参数做解码
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  // 对body参数做解码


// 2、拦截所有路由，并设置header：
app.all("*", (req, res, next) => {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || "*";
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true"); //可以带cookies
    res.header("X-Powered-By", "Express");
    if (req.method == "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 3、注册路由：
registerRouter(app);

// 4、将一个文件夹静态化：
//（1）当我们访问public文件夹中的文件时，可以不用输入这个文件夹名，就可以访问里面的所有文件（例如：输入这个访问： http://127.0.0.1:3000/img/default.jpg）
//（2）一般放在所有的路由地址后面定义，以防覆盖了前面的路由
app.use(express.static("./public"));

app.set("port", 8800);

// 5、初始化并连接数据库：
const connect = dbConnect("badminton");
export { connect };

// 初始化数据库表：
initTable().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

export default app;
