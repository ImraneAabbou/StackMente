<?php

namespace App\Enums;

enum ReportReason: string
{
    case SPAM_OR_CHEATING = 'SPAM_OR_CHEATING';
    case INAPPROPRIATE = 'INAPPROPRIATE';
    case OFFENSIVE_LANGUAGE = 'OFFENSIVE_LANGUAGE';
    case HARASSMENT = 'HARASSMENT';
    case OTHER = 'OTHER';
}
