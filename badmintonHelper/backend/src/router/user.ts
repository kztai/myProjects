import express from "express";
import { getBaseUserInfo, getAllUserInfo, setUserInfo } from "@/controllers/user";

const router = express.Router();

router.get("/userInfo", getBaseUserInfo);
router.post("/userInfo", setUserInfo);
router.get("/allUserInfo", getAllUserInfo);

export default router;