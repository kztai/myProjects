import User from "./user";
import Goods from "./goods";

export default (app: any) => {
    app.use("/badminton/api/user", User);
    app.use("/badminton/api/goods", Goods);
};