<?php

namespace App\Enums;

enum Period: string
{
    case MONTHLY = "MONTHLY";
    case WEEKLY = "WEEKLY";
    case DAILY = "DAILY";
    case YEARLY = "YEARLY";
}
