import jwt from "jsonwebtoken";
const secretKey = "kzt123"; //解密密钥（应保密）

const JWT = {
    createToken: (payload: any) => {
        const options = {
            expiresIn: "30day" // Token有效期为30天
        };
        return jwt.sign(payload, secretKey, options);
    },
    verifyToken: (token: string) => {
        // 如果token过期或验证失败，将返回false
        try {
            return jwt.verify(token, secretKey);
        } catch (error) {
            return false;
        }
    },
    decoded: (token: string) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error, result) => {
                if (error) {
                    reject(error.message);
                    return;
                }
                resolve(result);
            });
        });
    }
};

export default JWT;