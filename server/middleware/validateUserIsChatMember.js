import { matchedData } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { validate } from "../validators/index.js";
import { idRules } from "../validators/commonValidators.js";

/**
 * Validates member is chat member.
 * Must be used after `validateAuth`.
 */
export default [
  validate(idRules()),
  async (req, res, next) => {
    try {
      const { chatId } = matchedData(req);
      const membership = await prisma.chatMember.findUnique({
        where: {
          chatId_userId: { chatId: Number(chatId), userId: req.user.id },
        },
      });
      if (!membership) return res.sendStatus(404);
      req.memberRole = membership.role;
      return next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
