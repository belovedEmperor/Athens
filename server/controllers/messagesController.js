import { matchedData } from "express-validator";
import { objIsEmpty, prisma } from "../lib/prisma.js";
import { idRules } from "../validators/commonValidators.js";
import { validate } from "../validators/index.js";
import { createRules, updateRules } from "../validators/messagesValidators.js";
import { sendBodyError } from "../lib/responses.js";

export const get = [
  ...validate(idRules()),
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      const message = await prisma.message.findUnique({ where: { id } });
      res.json(message);
    } catch (err) {
      next(err);
    }
  },
];

export const getMine = async (req, res, next) => {
  try {
    const messages = await prisma.message.findUnique({
      where: { userId: req.user.id },
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const create = [
  ...validate(createRules()),
  async (req, res, next) => {
    try {
      const { text, chatId } = matchedData(req);

      const message = await prisma.message.create({
        data: { text, chatId, userId: req.user.id },
      });
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  },
];

export const update = [
  ...validate(updateRules()),
  async (req, res, next) => {
    try {
      const { text } = matchedData(req);

      const where = { id };
      const data = {};
      if (text) {
        where.text = { not: text };
        data.text = text;
      }

      if (objIsEmpty(data)) return sendBodyError({ msg: "Received no data." });
      const message = await prisma.message.updateManyAndReturn({
        where,
        data,
      });
      res.json(message[0]);
    } catch (err) {
      next(err);
    }
  },
];

export const remove = [
  ...validate(idRules()),
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      await prisma.message.delete({ where: { id } });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
];
