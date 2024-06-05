import { queryActivityList, queryApplyList, insertActivityData, queryActivityDetail, queryActivityAppliedInfo, queryAlternatedAppliedNum, querySelfApply, delActivity, updateActivityData, insertApplyData, updateApplyData, queryActivityByUserId, queryMyJoinActivity } from "@/models/activity";
import { queryUserInfo } from "@/models/user";
import { activityFieldMap, applyFieldMap, ApplyStatusEnum, ActivityStatusEnum } from "@/models/def";
import { decodeWxUserInfo, objPick } from "@/util/util";
import { ApplyFieldType } from "@/types/activity";
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
        const activityType = req.query.type;  // all-所有  myAll-我的所有 myRelease-我发布  myJoin-我参加的
        // 类型断言：
        const userInfo = <UserInfoType>await decodeWxUserInfo(req);
        let activityData;
        let myReleaseData;
        let myReleaseActivityId;
        let myJoinData;
        let myJoinActivityId;
        let arrActivityId;
        // 获取活动列表数据：
        switch (activityType) {
            case "all":
                activityData = await queryActivityList();
                break;
            case "myAll":
                myReleaseData = await queryActivityByUserId(userInfo.userId);
                myReleaseActivityId = myReleaseData.data.map((activity:Record<string,any>) => activity.id);
                myJoinData = await queryMyJoinActivity(userInfo.userId);
                myJoinActivityId = myJoinData.data.map((apply:Record<string,any>) => apply.parentId);
                arrActivityId = Array.from(new Set([...myReleaseActivityId, ...myJoinActivityId]));
                activityData = await queryActivityList(arrActivityId);
                break;
            case "myRelease":
                myReleaseData = await queryActivityByUserId(userInfo.userId);
                arrActivityId = myReleaseData.data.map((activity:Record<string,any>) => activity.id);
                activityData = await queryActivityList(arrActivityId);
                break;
            case "myJoin":
                myJoinData = await queryMyJoinActivity(userInfo.userId);
                arrActivityId = myJoinData.data.map((apply:Record<string,any>) => apply.parentId);
                activityData = await queryActivityList(arrActivityId);
                break;
        }

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
        const userInfo = <UserInfoType>await decodeWxUserInfo(req);
        const activityId = req.params.id;
        // 获取活动详情数据：
        const activityData = await queryActivityDetail(activityId);
        // 获取已报名数据：
        const applyData = await queryActivityAppliedInfo(activityId, ApplyStatusEnum.Applied);
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
    const data = req.body;

    data[activityFieldMap.addressData] = JSON.stringify(data[activityFieldMap.addressData]);

    // 判断填写的日期时间是否超过当前时间：
    if (new Date().getTime() > new Date(data[activityFieldMap.date] + " " + data[activityFieldMap.time]).getTime()) {
        data[activityFieldMap.status] = ActivityStatusEnum.Ended;
    } else {
        data[activityFieldMap.status] = ActivityStatusEnum.InProgress;
    }

    updateActivityData(data).then((result) => {
        res.send(result);
    }).catch((err: any) => {
        res.send(err);
    });
}

export function delActivityDetail(req: any, res: any): void {
    const activityId = req.params.id;
    delActivity(activityId).then((result) => {
        res.send(result);
    }).catch((err: any) => {
        res.send(err);
    });

}

export async function getApplyInfoList(req: any, res: any): Promise<void> {
    try {
        const activityId = req.query.activityId;
        // 获取已报名数据：
        const applyData = await queryActivityAppliedInfo(activityId);

        const result = {
            applied: [] as Record<string, any>[],
            alternatedApplied: [] as Record<string, any>[],
            notApplied: [] as Record<string, any>[],
        };

        applyData.data.forEach((item: Record<string, any>) => {
            switch (item[applyFieldMap.status]) {
                case ApplyStatusEnum.Applied:
                    result.applied.push(item);
                    break;
                case ApplyStatusEnum.AlternatedApplied:
                    result.alternatedApplied.push(item);
                    break;
                case ApplyStatusEnum.NotApplied:
                    result.notApplied.push(item);
                    break;
            }
        });

        res.send({
            code: 200,
            message: "",
            data: result
        });
    } catch (err) {
        res.send(err);
    }
}

export async function addActivityApply(req: any, res: any): Promise<void> {
    try {
        const activityId = req.body.activityId;
        // 类型断言：
        const wxUserInfo = <UserInfoType>await decodeWxUserInfo(req);

        // 获取详细用户信息：
        const userInfoData = await queryUserInfo(wxUserInfo.userId);
        const userInfo = userInfoData.data[0];

        delete userInfo.id;
        userInfo[applyFieldMap.parentId] = activityId;
        userInfo[applyFieldMap.applyTime] = new Date().toLocaleString();
        // 查询活动表，获取最大允许报名人数：
        const activityData = await queryActivityDetail(activityId);
        // 查询报名表，获取已报名数据：
        const appliedData = await queryActivityAppliedInfo(activityId, ApplyStatusEnum.Applied);
        // 判断报名人数是否已达最大人数：
        if (appliedData.data.length < activityData.data[0][activityFieldMap.maxApply]) {
            userInfo[applyFieldMap.status] = ApplyStatusEnum.Applied;
        } else {
            userInfo[applyFieldMap.status] = ApplyStatusEnum.AlternatedApplied;
        }
        const applyData = objPick(Object.keys(applyFieldMap), userInfo) as ApplyFieldType;

        // 需要判断以前是否已报过名：
        const selfApplydData = await querySelfApply(activityId, userInfo.userId);
        if (selfApplydData.data.length > 0) {
            // 已报过名，执行修改状态操作
            const result = await updateApplyData(activityId, userInfo.userId, { [applyFieldMap.status]: userInfo[applyFieldMap.status] });
            res.send(result);
        } else {
            // 未报过名，执行新增操作
            const result = await insertApplyData(applyData);
            res.send(result);
        }
    } catch (err) {
        res.send(err);
    }
}

export async function cancelActivityApply(req: any, res: any): Promise<void> {
    try {
        const activityId = req.body.activityId;
        // 类型断言：
        const userInfo = <UserInfoType>await decodeWxUserInfo(req);
        const applyData = {
            [applyFieldMap.status]: ApplyStatusEnum.NotApplied
        };

        const result = await updateApplyData(activityId, userInfo.userId, applyData);
        res.send(result);

    } catch (err) {
        res.send(err);
    }
}