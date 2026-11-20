import { Router } from "express";
import validateAuth from "../../middleware/validateAuth.js";
import { get, getMany, update } from "../../controllers/profilesController.js";
import validateProfileIsUsers from "../../middleware/validateProfileIsUsers.js";

const router = Router();

router.get("/", getMany);
router.get("/:id", validateAuth, get);
router.patch("/:id", validateAuth, validateProfileIsUsers, update);

export default router;
