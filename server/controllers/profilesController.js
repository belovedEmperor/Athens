import { matchedData } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { idRules } from "../validators/commonValidators.js";
import { validate } from "../validators/index.js";
import { updateRules } from "../validators/profileValidators.js";
import { conflict } from "../lib/responses.js";

export const get = [
  ...validate(idRules()),
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      const user = await prisma.userProfile.findUnique({ where: { id } });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
];

export const getMany = [
  async (req, res, next) => {
    try {
      const { limit, offset } = matchedData(req);
      const users = await prisma.userProfile.findMany({
        take: Number(limit) || 20,
        skip: Number(offset) || 0,
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
];

export const update = [
  ...validate(updateRules()),
  async (req, res, next) => {
    try {
      const { id, username, bio } = matchedData(req);
      const data = {};
      if (username) data.username = username;
      if (bio) data.bio = bio;

      const user = await prisma.userProfile.update({
        where: { id: Number(id) },
        data,
      });
      res.json(user);
    } catch (err) {
      if (err.code === "P2002")
        return conflict(res, err.meta?.target?.[0] ?? "username");
      next(err);
    }
  },
];
