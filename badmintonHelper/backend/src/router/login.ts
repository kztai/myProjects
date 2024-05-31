import express from "express";
import { wxLogin, wxLogout } from "@/controllers/login";

const router = express.Router();

router.post("/wxLogin", wxLogin);
router.post("/wxLogout", wxLogout);

export default router;