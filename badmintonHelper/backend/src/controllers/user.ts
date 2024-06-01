import { getUserInfo } from "@/controllers/userInfoList";
import { queryUserInfo } from "@/models/user";
import { userFieldMap } from "@/models/def";

export async function getBaseUserInfo(req: any, res: any): Promise<void> {
    try {
        const userId = req.query.userId;

        // 先从内存中获取用户信息，没有则从数据库获取：
        let userInfo = getUserInfo(userId);

        if(!userInfo) {
            // 获取活动详情数据：
            const res = await queryUserInfo(userId);
            userInfo = res.data[0] || {};
        }
        
        // 删除敏感信息：
        delete userInfo[userFieldMap.realName];
        delete userInfo[userFieldMap.phone];
        delete userInfo[userFieldMap.password];

        res.send({
            code: 200,
            message: "",
            data: userInfo
        });
    } catch (err) {
        res.send(err);
    }
}