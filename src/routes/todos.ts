import { Router } from "express";
import { todoController } from "@/controllers/todoController";
import {
    validateCreateTodo,
    validateUpdateTodo,
    validateTodoId,
    validateTodoQuery,
    validateAndHandle,
} from "@/middleware/validation";

const router = Router();

router.get(
    "/",
    validateAndHandle(validateTodoQuery),
    todoController.getAllTodos
);

router.get(
    "/stats",
    todoController.getTodoStats
);


router.get(
    "/:id",
    validateAndHandle(validateTodoId),
    todoController.getTodoById
);


router.post(
    "/",
    validateAndHandle(validateCreateTodo),
    todoController.createTodo
);

router.put(
    "/:id",
    validateAndHandle([
        ...validateTodoId,
        ...validateUpdateTodo,
    ]),
    todoController.updateTodo
);

router.patch(
    "/:id",
    validateAndHandle([
        ...validateTodoId,
        ...validateUpdateTodo,
    ]),
    todoController.patchTodo
);

router.delete(
    "/:id",
    validateAndHandle(validateTodoId),
    todoController.deleteTodo
);

export default router;