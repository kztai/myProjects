import JWT from "@/util/jwt";

export function decodeUserInfo(req: any) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return JWT.decoded(token);
}