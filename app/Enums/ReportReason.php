<?php

namespace App\Enums;

enum ReportReason: string
{
    case SPAM_OR_SCAM = 'SPAM_OR_SCAM';
    case FALSE_INFORMATION = "FALSE_INFORMATION";
    case CHEATING = 'CHEATING';
    case INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT';
    case OFFENSIVE_LANGUAGE = 'OFFENSIVE_LANGUAGE';
    case OTHER = 'OTHER';
}
