"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todoController_1 = require("@/controllers/todoController");
const validation_1 = require("@/middleware/validation");
const router = (0, express_1.Router)();
router.get("/", (0, validation_1.validateAndHandle)(validation_1.validateTodoQuery), todoController_1.todoController.getAllTodos);
router.get("/stats", todoController_1.todoController.getTodoStats);
router.get("/:id", (0, validation_1.validateAndHandle)(validation_1.validateTodoId), todoController_1.todoController.getTodoById);
router.post("/", (0, validation_1.validateAndHandle)(validation_1.validateCreateTodo), todoController_1.todoController.createTodo);
router.put("/:id", (0, validation_1.validateAndHandle)([
    ...validation_1.validateTodoId,
    ...validation_1.validateUpdateTodo,
]), todoController_1.todoController.updateTodo);
router.patch("/:id", (0, validation_1.validateAndHandle)([
    ...validation_1.validateTodoId,
    ...validation_1.validateUpdateTodo,
]), todoController_1.todoController.patchTodo);
router.delete("/:id", (0, validation_1.validateAndHandle)(validation_1.validateTodoId), todoController_1.todoController.deleteTodo);
exports.default = router;
