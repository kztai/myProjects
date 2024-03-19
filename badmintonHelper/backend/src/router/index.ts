import User from "./user";
import Goods from "./goods";

export default (app: any) => {
    app.use("/user", User);
    app.use("/goods", Goods);
};