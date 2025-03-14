import { YEARLY, MONTHLY } from "@/Enums/Period";
import { PostType } from "./post";

export interface Analysis {
    users: UsersAnalysis;
    posts: PostsAnalysis;
    system_usage: SystemUsage;
}

interface SystemUsage {
    disk_free: string;
    disk_free_percent: number;
    disk_total: string;
    disk_usage: string;
    disk_usage_percent: number;
    ram_free_percent: number;
    ram_free: string;
    ram_total: string;
    ram_usage: string;
    ram_usage_percent: number;
}

interface UsersAnalysis {
    total_users: number;
    total_admins: number;
    total_banned_users: number;
    registrations: AnalysisRecords;
}

interface PostsAnalysis {
    total_posts: number;
    total_questions: number;
    total_articles: number;
    total_subjects: number;
    publications: Record<PostType, AnalysisRecords>;
}

type AnalysisRecords = Record<
    typeof YEARLY | typeof MONTHLY,
    Record<string, number>
>;
