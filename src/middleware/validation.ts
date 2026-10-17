import { Request, Response, NextFunction } from "express";
import {
  body,
  param,
  query,
  validationResult,
  ValidationChain,
} from "express-validator";

const fields = ["text", "completed", "priority"];
function validBody(allowed: string[], required: string[]) {
  return body().custom((value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("Body must be a JSON object");
    const record = value as Record<string, unknown>;
    if (!Object.keys(record).length)
      throw new Error("At least one field is required");
    if (Object.keys(record).some((key) => !allowed.includes(key)))
      throw new Error("Unknown fields are not allowed");
    if (required.some((key) => record[key] === undefined))
      throw new Error(`Required fields: ${required.join(", ")}`);
    return true;
  });
}
const text = () =>
  body("text")
    .optional()
    .isString()
    .withMessage("Text must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Text cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Text must be at most 1000 characters");
const completed = () =>
  body("completed")
    .optional()
    .custom((value) => typeof value === "boolean")
    .withMessage("Completed must be a JSON boolean");
const priority = () =>
  body("priority")
    .optional()
    .isString()
    .bail()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high");
export const validateCreateTodo = [
  validBody(["text", "priority"], ["text"]),
  text(),
  priority(),
];
export const validateReplaceTodo = [
  validBody(fields, fields),
  text(),
  completed(),
  priority(),
];
export const validateUpdateTodo = [
  validBody(fields, []),
  text(),
  completed(),
  priority(),
];
export const validateTodoId = [
  param("id")
    .isInt({ min: 1, max: Number.MAX_SAFE_INTEGER })
    .withMessage("Id must be a positive safe integer"),
];
export const validateTodoQuery = [
  query().custom((value) => {
    const allowed = ["page", "limit", "completed", "priority", "search"];
    if (Object.keys(value).some((key) => !allowed.includes(key)))
      throw new Error("Unknown query parameters are not allowed");
    return true;
  }),
  query("page")
    .optional()
    .isString()
    .bail()
    .isInt({ min: 1, max: 1000000 })
    .withMessage("Page must be between 1 and 1000000"),
  query("limit")
    .optional()
    .isString()
    .bail()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("completed")
    .optional()
    .custom((value) => value === "true" || value === "false")
    .withMessage("Completed must be true or false"),
  query("priority")
    .optional()
    .isString()
    .bail()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string")
    .bail()
    .trim()
    .isLength({ max: 1000 }),
];
export function validateAndHandle(validators: ValidationChain[]) {
  return [
    ...validators,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) return next();
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: errors.array({ onlyFirstError: true }),
      });
    },
  ];
}
