import express from "express";
// import { getGoodsInfo } from "../controller/goods";
import { getGoodsInfo } from "@/controllers/goods";
import { setGoodsInfo } from "@/controllers/goods";

const router = express.Router();

router.get("/goodInfo", getGoodsInfo);
router.post("/goodInfo", setGoodsInfo);

export default router;