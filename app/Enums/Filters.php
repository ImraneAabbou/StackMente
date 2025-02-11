<?php

namespace App\Enums;

enum Filters: string
{
    case HAS_MARKED_ANSWER = 'HAS_MARKED_ANSWER';
    case NO_MARKED_ANSWER = 'NO_MARKED_ANSWER';
    case ANY = 'ANY';
}
