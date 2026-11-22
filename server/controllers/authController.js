import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import passport from "passport";
import { matchedData } from "express-validator";
import {
  loginRules,
  registerRules,
  updateRules,
} from "../validators/authValidators.js";
import { validate } from "../validators/index.js";
import { conflict, sendError } from "../lib/responses.js";

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
      const data = {};
      if (email) data.email = email;
      if (password)
        data.password = await bcrypt.hash(
          password,
          Number(process.env.SALT_LENGTH),
        );

      const user = await prisma.user.update({
        where: { id: req.user.id },
        data,
        omit: { password: true },
      });
      res.json(user);
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
