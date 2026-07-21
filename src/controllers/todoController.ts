import { Request, Response, NextFunction } from "express";
import { todoService } from "@/services/todoService";
import {
    CreateTodoInput,
    UpdateTodoInput,
    PaginationQuery,
} from "@/types/todo.types";

export const todoController = {

    getAllTodos(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

        const result = todoService.getTodos(req.query as PaginationQuery);
        res.status(200).json({

            success: true,
            data: result.todos,
            meta: result.meta,
        });

    } catch (error) {
        next(error);
    }
},

getTodoById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);
        const todo = todoService.getTodoById(id);

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

        } catch (error) {

        next(error);
        }
    },

    createTodo(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

        const input: CreateTodoInput = req.body;
        const todo = todoService.createTodo(input);
        
        return res.status(201).json({
            success: true,
            message: "Todo created successfully",
            data: todo,
        });

    } catch (error) {

        next(error);
    }
},

updateTodo(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const id = Number(req.params.id);
        const input: UpdateTodoInput = req.body;
        const updatedTodo = todoService.updateTodo(id, input);

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
} catch (error) {
    next(error);
    }
},
patchTodo(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No fields provided for update",
            });
        }

        const id = Number(req.params.id);
        const input: UpdateTodoInput = req.body;
        const updatedTodo = todoService.updateTodo(id, input);

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

    } catch (error) {
        next(error);
    }
},
deleteTodo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);
        const deleted = todoService.deleteTodo(id);
        if (!deleted) {
            return res.status(404).json({
            success: false,
            error: "Todo not found",
        });
    }
    
    return res.sendStatus(204);
} catch (error) {
    next(error);
    }
},
getTodoStats(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {
        const stats = todoService.getStats();
        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
        }
    },
};