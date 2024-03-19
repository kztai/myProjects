import express from "express";
import { getUserInfo } from "@/controllers/user";

const router = express.Router();

router.get("/userInfo", getUserInfo);

export default router;