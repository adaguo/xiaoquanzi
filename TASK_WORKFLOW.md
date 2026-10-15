# Proposal and task workflow

Generic circles use proposal support votes separately from completed-task result votes. New tasks are in_progress; marking completed retains them on the board. The board separates in-progress and completed items. New potluck templates call completion “已上桌”; Qiao uses that wording with its original dish-entry form.

The project template defaults to support-only voting. Other templates default to result voting after completion. Owners can change this in the vote section; it is saved as __meta.resultVoting. Existing projects identified by the old priority-vote module name retain the support-only default until explicitly changed. Turning result voting off does not remove old result votes.

New claims link task.sourceWishId to the original proposal and preserve a sourceWish snapshot. Generic proposals stay in the pool, with claimedBy/taskId; Qiao retains its existing behavior of removing the claimed wish from the pool. Releasing an in-progress task first restores/unassigns its proposal, retaining supportVotes/supporters and unknown legacy fields, then removes the execution item. Old tasks without linkage use the existing matching proposal or create a proposal on withdrawal; old result counts are retained as previousResultVotes, not mixed into support votes.

A completed task cannot be released. Explicit “删除记录” requires confirmation and removes the completion record separately; proposal history remains. Completing is never deletion. Legacy entries missing status count as in-progress; their existing result votes remain stored, but new result voting requires completion.

No table migration is required. The existing JSON rows remain in use. Multi-row withdrawal is not a database transaction: restoration failures leave the original task; failure after restoring a proposal leaves the task and the restored proposal available for retry. Claiming checks for a linked task before creating another. Simultaneous read-modify-write operations still inherit the existing JSON-row concurrency limits; client-side checks are not authoritative database constraints.

Verification uses isolated in-memory Supabase responses, never live writes:

- node tests/workflow.cjs
- LEGACY=1 node tests/workflow.cjs

The test runner needs Playwright and Chromium (CHROMIUM path defaults to /usr/bin/chromium). It starts and stops its own local server on port 8097. Tests cover general/project/Qiao, support-vote failure, withdrawal failures at both writes, vote and source preservation, completion failure and retention, result eligibility, the owner toggle and explicit completion deletion. Legacy tests cover assignments without status/source linkage and old vote counts. Existing six viewport/theme navigation, contact and gate checks also passed.
