import { Router } from "express";
import validateAuth from "../../middleware/validateAuth.js";
import validateUserIsChatMember from "../../middleware/validateUserIsChatMember.js";
import {
  create,
  get,
  getMine,
  remove,
  update,
} from "../../controllers/chatsController.js";
import validateUserIsChatAdmin from "../../middleware/validateUserIsChatAdmin.js";

const router = Router();

router.get("/:id", validateAuth, validateUserIsChatMember, get);
router.get("/me", validateAuth, getMine);
router.post("/", validateAuth, create);
router.patch(
  "/:id",
  validateAuth,
  validateUserIsChatMember,
  validateUserIsChatAdmin,
  update,
);
router.delete(
  "/:id",
  validateAuth,
  validateUserIsChatMember,
  validateUserIsChatAdmin,
  remove,
);

export default router;
