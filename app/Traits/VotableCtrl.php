<?php

namespace App\Traits;

use App\Enums\VoteType;
use App\Http\Requests\VoteRequest;
use Illuminate\Http\RedirectResponse;

trait VotableCtrl {
    /**
     * Vote up/down the votable
     *
     * @param Votable $votable
     */
    public function vote($votable, VoteRequest $request): RedirectResponse {
        $voteType = VoteType::from($request->type);

        $votable->vote(auth()->user(), $voteType);
        return back();
    }

    /**
     * Unvote the votable
     *
     * @param Votable $votable
     */
    public function unvote($votable): RedirectResponse {
        $votable->unvote(auth()->user());
        return back();
    }
}
