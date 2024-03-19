import { queryGoodsInfo, insertGoodsInfo} from "@/models/goods";

// req的用法：
// 0、req.body：获取post请求传递的数据（需先安装中间件bodyParser）
///1、const {limit = 20, offset = 0} = req.query;   //req.query 用于获取问号(query string)中的参数
///2、const admin_id = req.params.admin_id;  //访问 http://example.com/users/123 时，req.params.id 的值为 123； 路由定义为：app.get('/users/:id', function (req, res){})
///3、req.session.admin_id = admin_id;
///4、delete req.session.admin_id;

// res的用法：
// 1、res.cookie('cap', cap, { maxAge: 300000, httpOnly: true });
///2、res.send({
//     status: 1,
//     code: 'data:image/png;base64,' + base64
// });
///3、res.json({
//     name: 'ERROR_PARAM_TYPE',
//     message: '参数错误',
// })
///4、res.redirect(`${domain}${url}`);

export function getGoodsInfo(req: any, res: any): void {
    queryGoodsInfo(req.query).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    });
}

export function setGoodsInfo(req: any, res: any): void {
    const data = req.body;
    insertGoodsInfo(data).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    });
}