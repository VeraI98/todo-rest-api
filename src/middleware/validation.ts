import { Request, Response, NextFunction } from "express";
import {
    body,
    param,
    query,
    validationResult,
    ValidationChain,
} from "express-validator";

export const validateCreateTodo = [
    body("text")
        .trim()
        .notEmpty()
        .withMessage("Text is required"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium or high"),
];

export const validateUpdateTodo = [
    body("text")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Text cannot be empty"),

    body("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed must be true or false"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium or high"),
];

export const validateTodoId = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Id must be a positive integer"),
];

export const validateTodoQuery = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),

    query("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be greater than 0"),

    query("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed must be true or false"),

    query("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium or high"),

    query("search")
        .optional()
        .isString()
        .withMessage("Search must be a string"),
];

export function validateAndHandle(validators: ValidationChain[]) {
    return [
        ...validators,

        (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            error: "Validation Error",
            details: errors.array(),
        });
        },
    ];
}