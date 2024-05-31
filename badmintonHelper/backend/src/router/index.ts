import User from "./user";
import Activity from "./activity";
import Login from "./login";

export default (app: any) => {
    app.use("/badminton/api/user", User);
    app.use("/badminton/api/activity", Activity);
    app.use("/badminton/api/login", Login);
};