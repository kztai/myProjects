const userInfo = {};

export function getUserInfo(userId: string) {
    return userInfo[userId];
}

export function addUserInfo(userId: string, data:Record<string, any>) {
    userInfo[userId] = data;
}

export function modifyUserInfo(userId: string, data:Record<string, any>) {
    userInfo[userId] = data;
}

export function delUserInfo(userId: string) {
    delete userInfo[userId];
}
