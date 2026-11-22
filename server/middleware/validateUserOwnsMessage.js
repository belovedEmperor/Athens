import { matchedData } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { validate } from "../validators/index.js";
import { idRules } from "../validators/commonValidators.js";

export default [
  validate(idRules()),
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      const message = await prisma.message.findUnique({
        where: { id },
      });
      return message.userId !== req.user.id ? res.sendStatus(403) : next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
