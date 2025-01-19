<?php

namespace App\Models;

use App\Traits\Reportable;
use Illuminate\Contracts\Auth\MustVerifyEmail as IMustVerifyEmail;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements IMustVerifyEmail
{
    use HasFactory, Notifiable, MustVerifyEmail, SoftDeletes, Reportable;

    protected $fillable = [
        'fullname',
        'username',
        'email',
        'avatar',
        'password',
        'stats',
        'providers',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'stats' => 'array',
            'providers' => 'array',
        ];
    }

    /**
     * @return BelongsToMany<Mission,User>
     */
    public function missions(): BelongsToMany
    {
        return $this->belongsToMany(Mission::class)->withPivot('accomplished_at');
    }

    /**
     * @return HasMany<Post,User>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * @return HasMany<Comment,User>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * @return HasMany<Reply,User>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }
}
