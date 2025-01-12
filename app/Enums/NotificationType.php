<?php

namespace App\Enums;

enum NotificationType: string
{
    case ACHIEVEMENT = "ACHIEVEMENT";
    case COMMENT_RECEIVED = "COMMENT_RECEIVED";
    case REPLY_RECEIVED = "REPLY_RECEIVED";
    case VOTE_RECEIVED = "VOTE_RECEIVED";
    case OTHER = "OTHER";
}
