<?php

namespace App\Traits;

use App\Enums\VoteType;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Votable
{
    /*
     * get the votes model of the votable
     */
    public function votes(): MorphMany
    {
        /* @var Illuminate\Database\Eloquent\Model $this */
        return $this->morphMany(Vote::class, 'votable');
    }

    /*
     * the given user will vote UP/DOWN a votable
     */
    public function vote(User $user, string $type): void
    {
        $this->votes()->create([
            'user_id' => $user->id,
            'type' => $type
        ]);
    }

    /*
     * the given user will unvote the votable
     */
    public function unvote(User $user): void
    {
        $this->votes()->where('user_id', $user->id)->delete();
    }

    /*
     * is the user already voted on the votable or no
     */
    public function didUserVoted(User $user): bool
    {
        return $this->votes()->where('user_id', $user->id)->count();
    }

    /*
     * returns total up votes of the votable
     */
    public function totalUpVotes(): int
    {
        return $this->votes()->where('type', VoteType::UP)->count();
    }

    /*
     * returns total down votes of the votable
     */
    public function totalDownVotes(): int
    {
        return $this->votes()->where('type', VoteType::DOWN)->count();
    }

    /*
     * returns total votes of the votable
     */
    public function totalVotes(): int
    {
        return $this->totalUpVotes() - $this->totalDownVotes();
    }
}
