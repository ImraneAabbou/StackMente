import { User } from "./user";
import { Post } from "./post";
import { Mission } from "./mission";
import { Reply } from "./reply";
import { Comment } from "./comment";

export interface NotificationBase {
    id: string;
    created_at: string;
    read_at?: string;
};

export interface CommentReceivedNotification extends NotificationBase {
    user?: User;
    post: Post;
    comment: Comment;
    type: "COMMENT_RECEIVED";
}

export interface CommentVoteReceivedNotification extends NotificationBase {
    user?: User;
    post: Post;
    comment: Comment;
    type: "COMMENT_VOTE_RECEIVED";
}

export interface PostVoteReceivedNotification extends NotificationBase {
    user?: User;
    post: Post;
    type: "POST_VOTE_RECEIVED";
}

export interface ReplyReceivedNotification extends NotificationBase {
    user?: User;
    post: Post;
    reply: Reply;
    type: "REPLY_RECEIVED"
}

export interface MissionAccomplishedNotification extends NotificationBase {
    mission: Mission;
    type: "MISSION_ACCOMPLISHED";
}

export interface CommentMarkedNotification extends NotificationBase {
    user?: User;
    post: Post;
    comment: Comment;
    type: "COMMENT_MARKED"
}

export type Notification =
    CommentReceivedNotification
    | MissionAccomplishedNotification
    | ReplyReceivedNotification
    | PostVoteReceivedNotification
    | CommentMarkedNotification
    | CommentVoteReceivedNotification;
