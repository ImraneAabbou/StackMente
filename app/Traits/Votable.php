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
     * The given user will vote UP/DOWN or unvote a votable
     * Keep type null to unvote
     *
     * @param User $user The voter
     * @param VoteType $type type of the vote, null to unvote
     * @return \App\Models\Vote
     */
    public function vote(User $user, VoteType $type = null): Vote
    {
        return Vote::updateOrCreate(
            [
                'votable_id' => $this->id,
                'votable_type' => $this->getMorphClass(),
                'user_id' => $user->id
            ],
            [
                'type' => $type
            ]
        );
    }

    /*
     * The given user will unvote the votable
     * @return \App\Models\Vote
     */
    public function unvote(User $user): Vote
    {
        return $this->vote($user);
    }

    /*
     * is the user already voted on the votable or no
     */
    public function getUserVote(User $user): ?VoteType
    {
        return $this->votes()->select('type')->where('user_id', $user->id)->first()?->type;
    }

    /*
     * returns total up votes of the votable
     */
    public function upVotes(): MorphMany
    {
        return $this->votes()->where('type', VoteType::UP);
    }

    /*
     * returns total down votes of the votable
     */
    public function downVotes(): MorphMany
    {
        return $this->votes()->where('type', VoteType::DOWN);
    }
}
