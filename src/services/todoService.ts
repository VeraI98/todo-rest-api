import {
    Todo,
    CreateTodoInput,
    UpdateTodoInput,
    PaginationQuery,
} from "@/types/todo.types";


let todos: Todo[] = [];
let nextId = 1;


export const todoService = {

    getTodos(query: PaginationQuery) {

        let filteredTodos = [...todos];
        if (query.completed !== undefined) {
            const completed = query.completed === "true";
            filteredTodos = filteredTodos.filter(
                (todo) => todo.completed === completed
            );
        }

        if (query.priority) {
            filteredTodos = filteredTodos.filter(
            (todo) => todo.priority === query.priority
        );
        }

        if (query.search) {
            const searchText = query.search.toLowerCase();

            filteredTodos = filteredTodos.filter((todo) =>
            todo.text.toLowerCase().includes(searchText)
        );
        }

const page = Number(query.page) || 1;
const limit = Number(query.limit) || 10;
const startIndex = (page - 1) * limit;
const endIndex = startIndex + limit;
const paginatedTodos = filteredTodos.slice(
    startIndex,
    endIndex
);


return {

    todos: paginatedTodos,
    meta: {

        total: filteredTodos.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTodos.length / limit),
        },
    };
},


getTodoById(id: number): Todo | null {

    const todo = todos.find((todo) => todo.id === id);
    return todo || null;
},


createTodo(input: CreateTodoInput): Todo {

    const newTodo: Todo = {
        id: nextId++,
        text: input.text.trim(),
        completed: false,
        priority: input.priority || "medium",
        createdAt: new Date(),
    };

    todos.push(newTodo);
    return newTodo;
},

updateTodo(id: number, input: UpdateTodoInput): Todo | null {

    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
        return null;
    }

    const currentTodo = todos[index];
    const updatedTodo: Todo = {

        ...currentTodo,
        text:
            input.text !== undefined
            ? input.text.trim()
            : currentTodo.text,

        completed:
            input.completed !== undefined
            ? input.completed
            : currentTodo.completed,

        priority:
            input.priority !== undefined
            ? input.priority
            : currentTodo.priority,

        updatedAt: new Date(),
    };

    todos[index] = updatedTodo;

    return updatedTodo;
},


deleteTodo(id: number): boolean {

    const index = todos.findIndex(
        (todo) => todo.id === id
    );

    if (index === -1) {
        return false;
    }

    todos.splice(index, 1);
    return true;
},


getStats() {

    const completed = todos.filter(
        (todo) => todo.completed
    ).length;

    const pending = todos.length - completed;
    return {
        total: todos.length,
        completed,
        pending,
        byPriority: {

            low: todos.filter(
            (todo) => todo.priority === "low"
            ).length,

            medium: todos.filter(
            (todo) => todo.priority === "medium"
            ).length,

            high: todos.filter(
            (todo) => todo.priority === "high"
            ).length,
        },
        };
    },
};