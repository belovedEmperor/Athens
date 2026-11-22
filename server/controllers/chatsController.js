import { matchedData } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { idRules } from "../validators/commonValidators.js";
import { validate } from "../validators/index.js";
import { sendBodyError } from "../lib/responses.js";
import { createRules, updateRules } from "../validators/chatsValidators.js";

const mapMembersToData = (members) =>
  members.map((member) => {
    return { data: { userId: member.id, role: member.role } };
  });

export const get = [
  ...validate(idRules()),
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      const chat = await prisma.chat.findUnique({
        where: { id },
        include: { members: true, messages: true },
      });
      res.json(chat);
    } catch (err) {
      next(err);
    }
  },
];

export const getMine = async (req, res, next) => {
  try {
    const chats = await prisma.chat.findUnique({
      where: { userId: req.user.id },
      include: { members: true, messages: true },
    });
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

export const create = [
  ...validate(createRules()),
  async (req, res, next) => {
    try {
      const { type, name, members } = matchedData(req);

      const data = {
        type,
        name,
        members: { createMany: mapMembersToData(members) },
      };
      if (type === "DIRECT") {
        data.memberAId = Math.min(members[0].id, members[1].id);
        data.memberBId = Math.max(members[0].id, members[1].id);
      }

      const chat = await prisma.chat.create({
        data,
        include: { members: true, messages: true },
      });
      res.status(201).json(chat);
    } catch (err) {
      next(err);
    }
  },
];

export const update = [
  ...validate(updateRules()),
  async (req, res, next) => {
    try {
      const { id, name, members } = matchedData(req);

      const where = { id };
      const data = {};
      if (name) {
        data.name = name;
        where.name = { not: name };
      }
      if (members) {
        const membersData = mapMembersToData(members);
        data.members = membersData;
        where.members = { not: membersData };
      }

      if (objIsEmpty(data))
        return sendBodyError(res, {
          msg: "Name or members must not be empty.",
        });
      const chat = await prisma.chat.updateMany({
        where,
        data,
        include: { members: true, messages: true },
      });
      res.json(chat);
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
      await prisma.chat.delete({ where: { id } });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
];
