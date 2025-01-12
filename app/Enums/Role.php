<?php

namespace App\Enums;

enum Role: string
{
    case USER = 'USER';
    case ADMIN = 'ADMIN';
    case SUPER_ADMIN = 'SUPER_ADMIN';
}
