import express from "express";
import { getActivityList, getActivityDetail, addActivityDetail, modifyActivityDetail, delActivityDetail, getApplyInfoList, addActivityApply, cancelActivityApply } from "@/controllers/activity";

const router = express.Router();

router.get("/list", getActivityList);
router.get("/detail/:id", getActivityDetail);
router.post("/detail", addActivityDetail);
router.put("/detail", modifyActivityDetail);
router.delete("/detail/:id", delActivityDetail);
router.get("/applyInfo", getApplyInfoList);
router.post("/apply", addActivityApply);
router.delete("/apply", cancelActivityApply);

export default router;