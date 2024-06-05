import JWT from "@/util/jwt";

export function decodeWxUserInfo(req: any) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return JWT.decoded(token);
}

// 按arrTemplateField中的key，找出data中存在相应字段的值：
export function objPick(arrTemplateKey: string[], data: Record<string, any>) {
    const result = {};
    arrTemplateKey.forEach((key) => {
        if (data[key] !== undefined) {
            result[key] = data[key];
        }
    });
    return result;
}