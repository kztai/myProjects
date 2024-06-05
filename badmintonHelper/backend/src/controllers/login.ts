import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { UserInfoType } from "@/types/user";
import JWT from "@/util/jwt";
import {decodeWxUserInfo} from "@/util/util";
import { insertUserInfo, updateUserInfo, deleteUserInfo } from "@/models/user";
import { userFieldMap, LoginStatusEnum } from "@/models/def";

const appID = "wx69dfd1bcc838f7b8";
const appSecret = "416b0f612ce2b11ca16891c5f0fb5195";

export async function wxLogin(req: any, res: any): Promise<void> {
    const data = req.body;

    try {
        const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${data.code}&grant_type=authorization_code`);

        // response.data = {
        //  "openid":"xxxxxx",  //该小程序下用户唯一标识 OpenID。每个微信用户在同一个小程序中的 OpenID 是唯一的，不同的小程序之间的 OpenID 是不同的。
        //  "session_key":"xxxxx",  // 会话密钥
        //  "unionid":"xxxxx",  // 在微信平台下的多个关联公众号、小程序和移动应用中，对一个用户的唯一标识。
        //  "errcode":0,
        //  "errmsg":"xxxxx"
        // }

        // 给每个登陆者分一个唯一Id： 
        const userId = uuidv4();
        // 创建token：
        const token = JWT.createToken({
            userId,
            openid: response.data.openid,
            session_key: response.data.session_key,
            unionid: response.data.unionid,
        });

        data.userInfo.userId = userId;
        const userInfo = {
            ...data.userInfo,
            realName: "",
            phone: null,
            level: 0,
            singleSession: 0,
            singleWinRate: "0%",
            doubleSession: 0,
            doubleWinRate: "0%",
            singleRefereeSession: 0,
            doubleRefereeSession: 0,
            loginStatus: LoginStatusEnum.In, //1登录，0未登录
        };

        await insertUserInfo(userInfo);
   

        res.send({
            code: 200,
            message: "",
            data: {
                token,
                userInfo: data.userInfo
            }
        });
    } catch (err) {
        res.send(err);
    }
}

export async function wxLogout(req: any, res: any) {
    try {
        // 类型断言：
        const wxUserInfo = <UserInfoType>await decodeWxUserInfo(req);
        // const userInfo = {
        //     [userFieldMap.loginStatus]: LoginStatusEnum.Out
        // };
        // await updateUserInfo(wxUserInfo.userId, userInfo);

        await deleteUserInfo(wxUserInfo.userId);

        res.send({
            code: 200,
            message: "",
            data: {}
        });
    } catch (err) {
        res.send(err);
    }
}