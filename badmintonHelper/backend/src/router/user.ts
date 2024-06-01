import express from "express";
import { getBaseUserInfo } from "@/controllers/user";

const router = express.Router();

router.get("/userInfo", getBaseUserInfo);

export default router;