import bcrypt from "bcryptjs";
import { objIsEmpty, prisma, updatedNothing } from "../lib/prisma.js";
import passport from "passport";
import { matchedData } from "express-validator";
import {
  loginRules,
  registerRules,
  updateRules,
} from "../validators/authValidators.js";
import { validate } from "../validators/index.js";
import { conflict, sendBodyError, sendError } from "../lib/responses.js";

export const register = [
  ...validate(registerRules()),
  async (req, res, next) => {
    try {
      const { username, email, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT_LENGTH),
      );

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          userProfile: { create: { username } },
        },
        include: { userProfile: true },
        omit: { password: true },
      });

      return req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          email: user.email,
          profile: user.userProfile,
        });
      });
    } catch (err) {
      if (err.code === "P2002")
        return conflict(res, err.meta?.target?.[0] ?? "email");
      next(err);
    }
  },
];

export const login = [
  ...validate(loginRules()),
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return sendError(res, {
          status: 401,
          msg: "Incorrect email or password.",
        });
      req.login(user, (err) => {
        if (err) return next(err);
        res.json({
          id: user.id,
          email: user.email,
          profile: user.userProfile,
        });
      });
    })(req, res, next);
  },
];

export function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(204);
  });
}

export async function get(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { userProfile: true },
      omit: { password: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export const update = [
  ...validate(updateRules()),
  async (req, res, next) => {
    try {
      const { email, password } = matchedData(req);

      const where = { id: req.user.id };
      const data = {};
      if (email) {
        where.email = { not: email };
        data.email = email;
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(
          password,
          Number(process.env.SALT_LENGTH),
        );
        where.password = { not: hashedPassword };
        data.password = hashedPassword;
      }

      if (objIsEmpty(data))
        return sendBodyError(res, { msg: "Received no data." });
      const user = await prisma.user.updateManyAndReturn({
        where,
        data,
        omit: { password: true },
      });
      res.json(user[0]);
    } catch (err) {
      if (err.code === "P2002")
        return conflict(res, err.meta?.target?.[0] ?? "email");
      next(err);
    }
  },
];

export async function remove(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
