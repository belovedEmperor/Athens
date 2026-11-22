import { matchedData } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { validate } from "../validators/index.js";
import { idRules } from "../validators/commonValidators.js";

export default [
  validate(idRules()),
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      const profile = await prisma.userProfile.findUnique({
        where: { id: Number(id) },
      });
      if (!profile) return res.sendStatus(404);
      return req.user.id === profile.userId ? next() : res.sendStatus(401);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
