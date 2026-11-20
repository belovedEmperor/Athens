import { Router } from "express";
import authRouter from "./authRouter.js";
import profilesRouter from "./profilesRouter.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/profiles", profilesRouter);

export default router;
