import { AccomplishedMission } from "./mission";
import { Post } from "./post";

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
    posts: Post[];
    hasPassword: boolean;
    providers: {
        github?: object;
        facebook?: object;
        google?: object;
    };
    missions: AccomplishedMission[];
}

export interface RankedUser extends User {
    rank: number
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

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";
