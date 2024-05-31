import { queryActivityList, queryApplyList, insertActivityData, queryActivityDetail, queryActivityAppliedInfo, queryAlternatedAppliedNum, querySelfApply, delActivity } from "@/models/activity";
import { TableNameMap, activityFieldMap, applyFieldMap, ApplyStatusEnum, ActivityStatusEnum } from "@/models/def";
import { decodeUserInfo } from "@/util/util";
import { UserInfoType } from "@/types/user";

// req的用法：
// 0、req.body：获取post请求传递的数据（需先安装中间件bodyParser）
///1、const {limit = 20, offset = 0} = req.query;   //req.query 用于获取问号(query string)中的参数
///2、const admin_id = req.params.id;  //访问 http://example.com/users/123 时，req.params.id 的值为 123； 路由定义为：app.get('/users/:id', function (req, res){})
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

export async function getActivityList(req: any, res: any): Promise<void> {
    try {
        // 获取活动列表数据：
        const activityData = await queryActivityList();
        // 获取报名列表数据：
        const applyData = await queryApplyList();

        const tempApplyData = {};

        // 格式化报名数据：
        for (let i = 0; i < applyData.data.length; i++) {
            if (!tempApplyData[applyData.data[i].parentId]) {
                tempApplyData[applyData.data[i].parentId] = [];
            }
            tempApplyData[applyData.data[i].parentId].push(applyData.data[i]);
        }

        // 将报名数据插入活动数据中：
        for (let i = 0; i < activityData.data.length; i++) {
            activityData.data[i][activityFieldMap.addressData] = JSON.parse(activityData.data[i][activityFieldMap.addressData]);
            activityData.data[i].curApply = tempApplyData[activityData.data[i].id]?.length || 0;
            activityData.data[i].alternate = 0;  //todo 待设计
            activityData.data[i].avatarList = tempApplyData[activityData.data[i].id] || [];
        }

        res.send(activityData);
    } catch (err) {
        res.send(err);
    }

}

export async function getActivityDetail(req: any, res: any): Promise<void> {
    try {
        // 类型断言：
        const userInfo = <UserInfoType>await decodeUserInfo(req);
        const activityId = req.params.id;
        // 获取活动详情数据：
        const activityData = await queryActivityDetail(activityId);
        // 获取已报名数据：
        const applyData = await queryActivityAppliedInfo(activityId);
        // 获取候补人数数量：
        const alternateField = "count(*)";
        const alternatedAppliedData = await queryAlternatedAppliedNum(activityId, alternateField);
        // 查询自己是否报名：
        const selfApplydData = await querySelfApply(activityId, userInfo.userId);

        // 将报名数据插入活动数据中：
        activityData.data[0][activityFieldMap.addressData] = JSON.parse(activityData.data[0][activityFieldMap.addressData]);
        activityData.data[0].curApply = applyData.data.length;
        activityData.data[0].alternate = alternatedAppliedData.data[0][alternateField];
        activityData.data[0].applyStatus = selfApplydData.data[0] ? selfApplydData.data[0][applyFieldMap.status] : ApplyStatusEnum.NotApplied;
        activityData.data[0].avatarList = applyData.data || [];

        // 按前端需求的格式返回：
        activityData.data = activityData.data[0];

        res.send(activityData);
    } catch (err) {
        res.send(err);
    }
}

export function addActivityDetail(req: any, res: any): void {
    const data = req.body;

    data[activityFieldMap.browse] = 0;
    data[activityFieldMap.browsePerson] = 0;
    data[activityFieldMap.addressData] = JSON.stringify(data[activityFieldMap.addressData]);

    // 判断填写的日期时间是否超过当前时间：
    if (new Date().getTime() > new Date(data[activityFieldMap.date] + " " + data[activityFieldMap.time]).getTime()) {
        data[activityFieldMap.status] = ActivityStatusEnum.Ended;
    } else {
        data[activityFieldMap.status] = ActivityStatusEnum.InProgress;
    }

    insertActivityData(data).then((result) => {
        res.send(result);
    }).catch((err: any) => {
        res.send(err);
    });
}

export function modifyActivityDetail(req: any, res: any): void {
    // {
    //     id: "id",
    //     name: "name",
    //     date: "date",
    //     time: "time",
    //     addressData: "addressData",
    //     fieldNum: "fieldNum",
    //     maxApply: "maxApply",
    //     chargingMethod: "chargingMethod",
    //     malePay: "malePay",
    //     femalePay: "femalePay",
    //     refundTicket: "refundTicket",
    //     supplement: "supplement",
    //     browse: "browse",
    //     browsePerson: "browsePerson",
    //     status: "status",
    //     organizerId: "organizerId",
    //     organizerName: "organizerName",
    //     organizerAvatarUrl: "organizerAvatarUrl",
    // }
    res.send(1);
}

export function delActivityDetail(req: any, res: any): void {
    const activityId = req.params.id;
    delActivity(activityId).then((result) => {
        res.send(result);
    }).catch((err: any) => {
        res.send(err);
    });

}

export function getApplyInfo(req: any, res: any): void {
    res.send(1);
}

export function addActivityApply(req: any, res: any): void {
    res.send(1);
}

export function cancelActivityApply(req: any, res: any): void {
    res.send(1);
}