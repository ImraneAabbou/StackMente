import { ARTICLE, SUBJECT, QUESTION } from "@/Enums/PostType";
import { UP, DOWN } from "@/Enums/VoteType";
import { Tag } from "./tag";
import { User } from "./user";

export interface Post {
    id: number;
    slug: string;
    title: string;
    views: number;
    content: string;
    up_votes_count: number;
    down_votes_count: number;
    user_vote?: typeof UP | typeof DOWN;
    type: typeof ARTICLE | typeof SUBJECT | typeof QUESTION;
    comments_count: number;
    tags: Tag[];
    user: User;
    user_id: number;
    created_at: string;
    updated_at: string;
    answer_exists: boolean;
}

export interface Article extends Post {
    type: typeof QUESTION;
}

export interface Question extends Post {
    type: typeof QUESTION;
}

export interface Subject extends Post {
    type: typeof SUBJECT;
}
