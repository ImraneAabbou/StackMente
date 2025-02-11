<?php

namespace App\Enums;

enum Sorts: string
{
    case MORE_TO_LESS_ACTIVITY = "MORE_TO_LESS_ACTIVITY";
    case LESS_TO_MORE_ACTIVITY = "LESS_TO_MORE_ACTIVITY";
    case MORE_TO_LESS_VIEWS = "MORE_TO_LESS_VIEWS";
    case LESS_TO_MORE_VIEWS = "LESS_TO_MORE_VIEWS";
    case NEW_TO_OLD = "NEW_TO_OLD";
    case OLD_TO_NEW = "OLD_TO_NEW";
}
