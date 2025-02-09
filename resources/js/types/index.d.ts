import { User, RankedUser } from "./user";
import type { Notification } from "./notification";
import { TagWithCounts } from "./tag";
import { Post } from "./post";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    status?: string;
    auth: {
        user: User;
    };
    notifications: {
        items: Notification[];
        next_page_url?: string;
    };
    posts: {
        items: Post[];
        count: number;
        next_page_url?: string;
    };
    tags: {
        items: TagWithCounts[];
        count: number;
        next_link_url?: string;
    };
    rankings: {
        users: RankedUser[];
    };
};
