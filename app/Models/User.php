<?php

namespace App\Models;

use App\Enums\Role;
use App\Observers\UserObserver;
use App\Traits\Reportable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail as IMustVerifyEmail;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[ObservedBy(UserObserver::class)]
class User extends Authenticatable implements IMustVerifyEmail, HasLocalePreference
{
    use HasFactory, Notifiable, MustVerifyEmail, SoftDeletes, Reportable;

    protected $appends = ['totalReceivedUpVotes', 'totalReceivedDownVotes', 'totalReceivedViews'];

    protected $fillable = [
        'fullname',
        'username',
        'email',
        'avatar',
        'password',
        'stats',
        'bio',
        'role',
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
            'role' => Role::class
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

    static function onlyBanned(): Builder
    {
        return User::onlyTrashed()
            ->whereNotLike('fullname', 'deleted-%')
            ->whereNotLike('username', 'deleted-%');
    }

    static function withBanned(): Builder
    {
        return User::withTrashed()
            ->whereNotLike('fullname', 'deleted-%')
            ->whereNotLike('username', 'deleted-%');
    }

    /**
     * @return HasMany<Reply,User>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }

    public function answers(): HasMany
    {
        return $this->comments()->where('is_marked', true);
    }

    public function getTotalReceivedUpVotesAttribute(): int
    {
        return $this->posts->map(
            fn(Post $p) => $p->upVotes()->count()
        )->sum();
    }

    public function getTotalReceivedDownVotesAttribute(): int
    {
        return $this->posts->map(
            fn(Post $p) => $p->downVotes()->count()
        )->sum();
    }

    public function getTotalReceivedViewsAttribute(): int
    {
        return $this->posts->map(
            fn(Post $p) => $p->views
        )->sum();
    }

    public function resolveRouteBinding($value, $field = null): Model
    {
        return $this->withTrashed(
            collect([Role::ADMIN, Role::SUPER_ADMIN])->contains(auth()->user()?->role)
        )->where($field ?? 'id', $value)->firstOrFail();
    }

    /**
     * Get the user's preferred locale.
     */
    public function preferredLocale(): string
    {
        return $this->locale;
    }
}
