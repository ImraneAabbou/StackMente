import { User } from "./user";

export interface Reply {
    id: number;
    content: string;
    user: User
    user_id: number
}

