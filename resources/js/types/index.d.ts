export interface User {
    id: number;
    username: string;
    fullname: string;
    avatar?: string;
    stats: Stats;
    email: string;
    email_verified_at?: string;
    updated_at: string;
    created_at: string;
    last_interaction: string;
    role: Role;
    hasPassword: bool;
    providers: {
        github?: object;
        facebook?: object;
        google?: object;
    };
    missions: AccomplishedMission[];
}

export type Notification = {
    id: string;
    created_at: string;
    read_at?: string;
    type: NotificationType;
    user: User;
    post: Post;
    comment: Post;
    reply: Reply;
    mission: Mission;
};

interface Comment {
    id: number;
    content: string;
}

interface Reply {
    id: number;
    content: string;
}

interface Post {
    id: number;
    slug: string;
    title: string;
    views: number;
    content: string;
}

type NotificationType =
    | "COMMENT_RECEIVED"
    | "COMMENT_VOTE_RECEIVED"
    | "POST_VOTE_RECEIVED"
    | "REPLY_RECEIVED"
    | "MISSION_ACCOMPLISHED"
    | "COMMENT_MARKED";

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

type Mission = {
    id: number;
    created_at: string;
    image: string;
    title: string;
    description: string;
    threshold: string;
    xp_reward: string;
    type: string;
};

interface AccomplishedMission extends Mission {
    pivot: {
        accomplished_at: string;
    };
}

interface Stats {
    level: number;
    timespent: number;
    login: {
        streak: number;
        max_streak: number;
        streak_started_at: string;
    };
    rank: {
        daily: number;
        weekly: number;
        monthly: number;
        yearly: number;
        total: number;
    };
    xp: {
        daily: number;
        weekly: number;
        monthly: number;
        yearly: number;
        total: number;
        curr_level_total: number;
        next_level_total: number;
        percent_to_next_level: number;
    };
}

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
};
