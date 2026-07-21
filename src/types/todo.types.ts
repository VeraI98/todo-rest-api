export type Priority = "low" | "medium" | "high";

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    priority: Priority;
    createdAt: Date;
    updatedAt?: Date;
}

export interface CreateTodoInput {
    text: string;
    priority?: Priority;
}

export interface UpdateTodoInput {
    text?: string;
    completed?: boolean;
    priority?: Priority;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
    completed?: string;
    priority?: string;
    search?: string;
}