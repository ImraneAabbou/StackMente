import { USER, POST, COMMENT, REPLY } from "@/Enums/ReportableType";
import {
    OTHER,
    SPAM_OR_SCAM,
    INAPPROPRIATE_CONTENT,
    FALSE_INFORMATION,
    CHEATING,
    OFFENSIVE_LANGUAGE,
} from "@/Enums/ReportReason";
import { User } from "./user";
import { Post } from "./post";
import { Reply } from "./reply";
import { Comment } from "./comment";

export type ReportableType =
    | typeof USER
    | typeof COMMENT
    | typeof REPLY
    | typeof POST;

export type ReportReason =
    | typeof OTHER
    | typeof SPAM_OR_SCAM
    | typeof INAPPROPRIATE_CONTENT
    | typeof FALSE_INFORMATION
    | typeof CHEATING
    | typeof OFFENSIVE_LANGUAGE;

export interface BaseReport {
    id: number;
    reportable_id: number;
    user_id: number;
    reason: ReportReason;
    explanation: string;
    user: User;
    created_at: string;
}

export interface UserReport extends BaseReport {
    reportableType: typeof USER;
    reportable: User & { can_ban: boolean };
}

export interface PostReport extends BaseReport {
    reportableType: typeof POST;
    reportable: Post;
}
export interface ReplyReport extends BaseReport {
    reportableType: typeof REPLY;
    reportable: Reply;
}
export interface CommentReport extends BaseReport {
    reportableType: typeof COMMENT;
    reportable: Comment;
}

export type Report = UserReport | PostReport | ReplyReport | CommentReport;
