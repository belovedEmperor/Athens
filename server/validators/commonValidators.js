import { param } from "express-validator";

export const emptyMessage = "must not be empty.";

export const idRules = () =>
  param("id")
    .trim()
    .notEmpty()
    .withMessage(`Id ${emptyMessage}`)
    .isNumeric()
    .withMessage("Id must be numeric");
