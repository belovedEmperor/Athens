import { Router } from "express";
import validateAuth from "../../middleware/validateAuth.js";
import validateUserOwnsMessage from "../../middleware/validateUserOwnsMessage.js";
import validateUserIsChatMember from "../../middleware/validateUserIsChatMember.js";
import {
  create,
  get,
  getMine,
  remove,
  update,
} from "../../controllers/messagesController.js";

const router = Router();

router.get("/:id", validateAuth, validateUserOwnsMessage, get);
router.get("/me", validateAuth, getMine);
router.post("/", validateAuth, validateUserIsChatMember, create);
router.patch("/:id", validateAuth, validateUserOwnsMessage, update);
router.delete("/:id", validateAuth, validateUserOwnsMessage, remove);

export default router;
