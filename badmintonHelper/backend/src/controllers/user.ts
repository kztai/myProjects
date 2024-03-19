export function getUserInfo (req:any, res:any): void {
    // 这里去查数据库：
    const result = "返回userInfo数据";
    res.send({
        code: 200,
        msg: "",
        data: result
    });
}