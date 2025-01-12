<?php

namespace App\Enums;

enum ReportableType: string
{
    case USER = "USER";
    case POST = "POST";
    case COMMENT = "COMMENT";
    case REPLY = "REPLY";
}
