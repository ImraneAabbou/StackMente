import { User, RankedUser } from "./user";
import type { Notification } from "./notification";
import { Tag, TagWithCounts } from "./tag";
import { Article, Post, Question, Subject } from "./post";
import { Comment } from "./comment";
import { Backup } from "./backup";
import { Analysis } from "./analysis";
import { Mission } from "./mission";
import { Report, ReportReason } from "./report";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    status?: string;
    backups: Backup[];
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
        season_timeout: string;
        users: RankedUser[];
    };
    post: Post & {
        comments: Comment[];
        is_commented: boolean;
    };

    analysis: Analysis;

    missions: Mission[];

    mission: Mission;

    user: User & { can_ban: boolean };

    banned_users: {
        items: User[];
        next_page_url?: string;
    };

    reports: {
        next_page_url?: string;
        items: Report[];
    };

    reportableWithMessages: {
        next_page_url?: string;
        items: Report[];
    };

    count_items: Record<ReportReason, int>;

    tags_completions: Tag[];

    results: Results;

    hero_stats: {
        questions_count: number;
        articles_count: number;
        subjects_count: number;
    };
};

export interface Results {
    q: string;
    articles: {
        items: Article[];
        count: number;
    };
    subjects: {
        items: Subject[];
        count: number;
    };
    questions: {
        items: Question[];
        count: number;
    };
    tags: {
        items: Tag[];
        count: number;
    };
    users: {
        items: User[];
        count: number;
    };
}
