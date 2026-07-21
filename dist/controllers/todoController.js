"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoController = void 0;
const todoService_1 = require("@/services/todoService");
exports.todoController = {
    getAllTodos(req, res, next) {
        try {
            const result = todoService_1.todoService.getTodos(req.query);
            res.status(200).json({
                success: true,
                data: result.todos,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    },
    getTodoById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const todo = todoService_1.todoService.getTodoById(id);
            if (!todo) {
                return res.status(404).json({
                    success: false,
                    error: "Todo not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: todo,
            });
        }
        catch (error) {
            next(error);
        }
    },
    createTodo(req, res, next) {
        try {
            const input = req.body;
            const todo = todoService_1.todoService.createTodo(input);
            return res.status(201).json({
                success: true,
                message: "Todo created successfully",
                data: todo,
            });
        }
        catch (error) {
            next(error);
        }
    },
    updateTodo(req, res, next) {
        try {
            const id = Number(req.params.id);
            const input = req.body;
            const updatedTodo = todoService_1.todoService.updateTodo(id, input);
            if (!updatedTodo) {
                return res.status(404).json({
                    success: false,
                    error: "Todo not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Todo updated successfully",
                data: updatedTodo,
            });
        }
        catch (error) {
            next(error);
        }
    },
    patchTodo(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "No fields provided for update",
                });
            }
            const id = Number(req.params.id);
            const input = req.body;
            const updatedTodo = todoService_1.todoService.updateTodo(id, input);
            if (!updatedTodo) {
                return res.status(404).json({
                    success: false,
                    error: "Todo not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Todo updated successfully",
                data: updatedTodo,
            });
        }
        catch (error) {
            next(error);
        }
    },
    deleteTodo(req, res, next) {
        try {
            const id = Number(req.params.id);
            const deleted = todoService_1.todoService.deleteTodo(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: "Todo not found",
                });
            }
            return res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    },
    getTodoStats(req, res, next) {
        try {
            const stats = todoService_1.todoService.getStats();
            return res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
