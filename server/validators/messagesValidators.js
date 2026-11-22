import { body } from "express-validator";
import { emptyMessage } from "./commonValidators";

export const textRule = () =>
  body("text")
    .trim()
    .notEmpty()
    .withMessage(`Text ${emptyMessage}`)
    .isLength({ max: 5000 })
    .withMessage(`Text must be less than 5000 characters.`);

export const createRules = () => [textRule()];

export const updateRules = () => [
  body("text")
    .optional({ values: "falsy" })
    .withMessage(`Text ${emptyMessage}`)
    .isLength({ max: 5000 })
    .withMessage(`Text must be less than 5000 characters.`),
];
