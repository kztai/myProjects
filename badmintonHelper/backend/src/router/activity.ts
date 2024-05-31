import express from "express";
import { getActivityList, getActivityDetail, addActivityDetail, modifyActivityDetail, delActivityDetail, getApplyInfo, addActivityApply, cancelActivityApply } from "@/controllers/activity";

const router = express.Router();

router.get("/list", getActivityList);
router.get("/detail/:id", getActivityDetail);
router.post("/detail", addActivityDetail);
router.put("/detail", modifyActivityDetail);
router.delete("/detail", delActivityDetail);
router.get("/applyInfo", getApplyInfo);
router.post("/apply", addActivityApply);
router.delete("/apply", cancelActivityApply);

export default router;