import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { emptyMessage } from "./commonValidators.js";

const passwordMessage =
  "Password must be 8-25 characters with at least one uppercase letter, one lowercase letter, one number, and one symbol.";

const usernameRules = () =>
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${emptyMessage}`)
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .isLength({ min: 1, max: 25 })
    .withMessage("Username must have between 1 and 25 characters.")
    .custom(async (value) => {
      if (await prisma.userProfile.findUnique({ where: { username: value } })) {
        throw new Error("Username already in use.");
      }
    });

export const emailRules = () =>
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage(`Email ${emptyMessage}`)
    .isEmail()
    .withMessage("Email must be valid.");

export const passwordRules = () =>
  body("password")
    .trim()
    .isLength({ min: 8, max: 25 })
    .withMessage("Password must be between 8 and 25 characters.")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(passwordMessage);

export const confirmPasswordRules = () =>
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage(`Password confirmation ${emptyMessage}`)
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password confirmation must match password.");

export const loginRules = () => [
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage(`Email ${emptyMessage}`),
  body("password").trim().notEmpty().withMessage(`Password ${emptyMessage}`),
];

export const registerRules = () => [
  emailRules(),
  body("email").custom(async (value) => {
    if (await prisma.user.findUnique({ where: { email: value } })) {
      throw new Error("Email already in use.");
    }
  }),
  passwordRules(),
  usernameRules(),
  confirmPasswordRules(),
];

export const updateRules = () => [
  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Email must be valid."),
  body("password")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 8, max: 25 })
    .withMessage("Password must be between 8 and 25 characters.")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(passwordMessage)
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password confirmation must match password."),
  body("confirmPassword")
    .optional({ checkFalsy: true })
    .trim()
    .custom((value, { req }) => value === req.body.confirmPassword.trim())
    .withMessage("Password confirmation must match password."),
];
