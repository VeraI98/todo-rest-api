"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTodoQuery = exports.validateTodoId = exports.validateUpdateTodo = exports.validateCreateTodo = void 0;
exports.validateAndHandle = validateAndHandle;
const express_validator_1 = require("express-validator");
exports.validateCreateTodo = [
    (0, express_validator_1.body)("text")
        .trim()
        .notEmpty()
        .withMessage("Text is required"),
    (0, express_validator_1.body)("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium or high"),
];
exports.validateUpdateTodo = [
    (0, express_validator_1.body)("text")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Text cannot be empty"),
    (0, express_validator_1.body)("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed must be true or false"),
    (0, express_validator_1.body)("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium or high"),
];
exports.validateTodoId = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Id must be a positive integer"),
];
exports.validateTodoQuery = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be greater than 0"),
    (0, express_validator_1.query)("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed must be true or false"),
    (0, express_validator_1.query)("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium or high"),
    (0, express_validator_1.query)("search")
        .optional()
        .isString()
        .withMessage("Search must be a string"),
];
function validateAndHandle(validators) {
    return [
        ...validators,
        (req, res, next) => {
            const errors = (0, express_validator_1.validationResult)(req);
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
