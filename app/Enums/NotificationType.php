<?php

namespace App\Enums;

enum NotificationType: string
{
    case ACHIEVEMENT = "ACHIEVEMENT";
    case COMMENT_RECEIVED = "COMMENT_RECEIVED";
    case REPLY_RECEIVED = "REPLY_RECEIVED";
    case POST_VOTE_RECEIVED = "POST_VOTE_RECEIVED";
    case COMMENT_VOTE_RECEIVED = "COMMENT_VOTE_RECEIVED";
    case OTHER = "OTHER";
}
