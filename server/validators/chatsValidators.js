import { body } from "express-validator";
import { emptyMessage } from "./commonValidators";

export const typeRule = () =>
  body("type")
    .trim()
    .notEmpty()
    .withMessage(`Id ${emptyMessage}`)
    .isIn(["DIRECT", "GROUP"])
    .withMessage("Type must be 'DIRECT' or 'GROUP'.");

export const nameRule = () =>
  body("name")
    .optional({ values: "falsy" })
    .trim()
    .custom((value, { req }) => {
      if (req.body.type === "DIRECT")
        throw new Error("Direct chats cannot be named.");
      return true;
    });

export const membersRule = () =>
  body("members")
    .isArray({ min: 2 })
    .withMessage("Chats must have at least 2 members.")
    .custom((value, { req }) => {
      if (req.body.type === "DIRECT" && value.length !== 2)
        throw new Error("Direct chats must have exactly 2 members.");
      return true;
    });

export const createRules = () => [typeRule(), nameRule(), membersRule()];

export const updateRules = () => [
  body("type")
    .optional({ values: "falsy" })
    .trim()
    .isIn(["DIRECT", "GROUP"])
    .withMessage("Type must be 'DIRECT' or 'GROUP'."),
  nameRule(),
  body("members")
    .optional({ values: "falsy" })
    .isArray({ min: 2 })
    .withMessage("Chats must have at least 2 members.")
    .custom((value, { req }) => {
      if (req.body.type === "DIRECT")
        throw new Error("Direct chat members cannot be changed.");
      return true;
    }),
];
