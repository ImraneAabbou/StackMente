import {
    EMAIL_VERIFICATION,
    LINKING_WITH_PROVIDERS,
    PROFILE_SETUP,
    LOGIN_STREAK,
    LEVEL,
    XP_TOTAL,
    XP_DAILY,
    XP_WEEKLY,
    XP_MONTHLY,
    XP_YEARLY,
    TIMESPENT,
    TOTAL_OWNED_POSTS,
    TOTAL_OWNED_ARTICLES,
    TOTAL_OWNED_QUESTIONS,
    TOTAL_OWNED_SUBJECTS,
    TOTAL_MARKED_COMMENTS,
    TOTAL_MADE_COMMENTS,
    MADE_POSTS_VOTE_UPS,
    MADE_POSTS_VOTE_DOWNS,
    RECEIVED_POSTS_VOTE_UPS,
    MADE_COMMENTS_VOTE_UPS,
    MADE_COMMENTS_VOTE_DOWNS,
    RECEIVED_COMMENTS_VOTE_UPS,
} from "@/Enums/MissionType";

export interface Mission {
    id: number;
    created_at: string;
    image: string;
    title: string;
    description: string;
    threshold: number;
    xp_reward: number;
    translation_key: string;
    type: MissionType;
}

export type MissionType =
    | typeof EMAIL_VERIFICATION
    | typeof LINKING_WITH_PROVIDERS
    | typeof PROFILE_SETUP
    | typeof LOGIN_STREAK
    | typeof LEVEL
    | typeof XP_TOTAL
    | typeof XP_DAILY
    | typeof XP_WEEKLY
    | typeof XP_MONTHLY
    | typeof XP_YEARLY
    | typeof TIMESPENT
    | typeof TOTAL_OWNED_POSTS
    | typeof TOTAL_OWNED_ARTICLES
    | typeof TOTAL_OWNED_QUESTIONS
    | typeof TOTAL_OWNED_SUBJECTS
    | typeof TOTAL_MARKED_COMMENTS
    | typeof TOTAL_MADE_COMMENTS
    | typeof MADE_POSTS_VOTE_UPS
    | typeof MADE_POSTS_VOTE_DOWNS
    | typeof RECEIVED_POSTS_VOTE_UPS
    | typeof MADE_COMMENTS_VOTE_UPS
    | typeof MADE_COMMENTS_VOTE_DOWNS
    | typeof RECEIVED_COMMENTS_VOTE_UPS;
export interface AccomplishedMission extends Mission {
    pivot: {
        accomplished_at: string;
    };
}
