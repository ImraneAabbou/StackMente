import { Comment } from "./comment";
import { User } from "./user";

export interface Reply {
    id: number;
    content: string;
    user: User;
    comment: Comment;
    user_id: number;
    comment_id: number;
}
