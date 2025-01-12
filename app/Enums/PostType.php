<?php

namespace App\Enums;

enum PostType: string
{
    case ARTICLE = "ARTICLE";
    case QUESTION = "QUESTION";
    case SUBJECT = "SUBJECT";
}
