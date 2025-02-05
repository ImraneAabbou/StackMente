import { User } from "./user";
import type { Notification } from "./notification";
import { TagWithCounts } from "./tag";

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
    tags: {
        items: TagWithCounts[];
        count: number;
        next_link_url?: string;
    };
};
