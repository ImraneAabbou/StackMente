import { Reply } from "./reply";
import { User } from "./user";
import { UP, DOWN } from "@/Enums/VoteType";

export interface Comment {
    id: number;
    content: string;
    user_id: number;
    is_marked: boolean;
    user: User;
    replies_count: number;
    up_votes_count: number;
    down_votes_count: number;
    user_vote?: typeof UP | typeof DOWN;
    replies: Reply[]
}
