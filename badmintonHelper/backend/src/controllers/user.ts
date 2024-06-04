import { queryUserInfo, updateUserInfo } from "@/models/user";
import { userFieldMap } from "@/models/def";

export async function getBaseUserInfo(req: any, res: any): Promise<void> {
    try {
        const userId = req.query.userId;

       // 获取活动详情数据：
       const userInfoData = await queryUserInfo(userId);
       const userInfo = userInfoData.data[0] || {};
        
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

export async function getAllUserInfo(req: any, res: any): Promise<void> {
    try {
        const userId = req.query.userId;

         // 获取活动详情数据：
         const userInfoData = await queryUserInfo(userId);
         const userInfo = userInfoData.data[0] || {};
        
        // 删除敏感信息：
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

export async function setUserInfo(req: any, res: any): Promise<void> {
    try {
        const userInfo = req.body;

        await updateUserInfo(userInfo.userId, userInfo);

        res.send({
            code: 200,
            message: "",
            data: []
        });
    } catch (err) {
        res.send(err);
    }
}