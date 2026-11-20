import { body, query } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { idRules } from "./commonValidators.js";

export const searchRules = () => [
  query("limit")
    .optional()
    .trim()
    .isNumeric()
    .withMessage(`Limit ${numberErr}`),
  query("offset")
    .optional()
    .trim()
    .isNumeric()
    .withMessage(`Limit ${numberErr}`),
];

export const updateRules = () => [
  idRules(),
  body("username")
    .optional({ checkFalsy: true })
    .trim()
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .isLength({ min: 1, max: 25 })
    .withMessage("Username must have between 1 and 25 characters.")
    .custom(async (value) => {
      if (await prisma.userProfile.findUnique({ where: { username: value } })) {
        throw new Error("Username already in use.");
      }
    }),
  body("bio")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Bio must have between 1 and 150 characters."),
];
