# Process & verification

How work is planned, checked and finished in this repository.

> Part of this repository's rule set. The always-loaded core is [`AGENTS.md`](../../AGENTS.md)
> at the repository root. It indexes every rule in this file. These rules are mandatory, not
> advisory.

## Ask structured questions while planning

During the planning phase of any task, act as a product manager whose goal is the best possible
first result. Put each open decision and each needed clarification to the user as a structured
question: one question at a time, with concrete options, the trade-off of each, and your
recommended option first. Agents and harnesses differ, so do not assume a particular tool: if
your harness has a structured-question or user-input tool, use it; otherwise ask in plain text,
one question per message, with numbered options. Wait for each answer before you ask the next
question, because an answer often changes or removes the questions after it. Ask only what the
user must decide: find facts in the code and documents yourself, and use a choice's single
sensible default without asking, then state it. When no person can answer (an unattended or
scheduled run), use the recommended option and record each assumption in the plan and the PR
description.

## Have the work verified in a fresh context before pushing

Before you push, have the change reviewed by a reviewer that has not seen your reasoning: a
sub-agent in a fresh context, or another person. Give it the task and the diff, not your
conclusion. Ask it to try to break the change: correctness, regressions in existing behaviour,
security, and whether the change does what was asked.

- **Scale the review to the change.** A typo fix needs a quick read. A new feature, or a change
  that touches money, tickets, credentials or tenant data, needs a full pass.
- **Act on what comes back.** Fix real in-scope defects before you push. Record out-of-scope
  findings in the PR description. Do not enlarge the change to clear them.
- **Stop when the review converges.** After three rounds, fix only defects that can cause
  downtime, a security breach, monetary loss, lost work or a proven regression.

## Audit every caller before changing a shared contract

Before changing a shared framework or API signature, default, or behaviour, identify and audit
**all** callers and overrides, including indirect, dynamic, and cross-repository consumers. Test
every affected caller and override against the proposed contract; reflection, unit and focused
harness tests alone do not establish compatibility. Never change a contract merely to make an
E2E test pass. If any caller or override cannot be identified or assessed, do not change the
contract; surface the gap and its impact.

## Functionality changes ship central E2E coverage

Every new, changed or bug-fixed functionality adds or updates executable end-to-end tests in
[theticketfairy/automated-testing](https://github.com/theticketfairy/automated-testing) in the
same body of work. Follow the central
[E2E policy](https://github.com/theticketfairy/automated-testing/blob/main/docs/E2E_POLICY.md).
A documentation-only, formatting-only or internal refactor change that alters no functionality
does not need a new E2E scenario; say why in the PR and run the relevant existing checks. Where
`AGENTS.md` carries a fuller version of this rule, that version applies.

## The PR description describes the change, not the journey

Write the PR description for a reviewer who sees only the code now in the PR. Describe what the
change delivers and how it was verified. When the PR changes during review, rewrite the
description so it stays correct. Do not append a log of each round.

## Clean up local worktrees after merge

When the work in a local git worktree is pushed to GitHub and its pull request is merged,
remove that worktree and its local branch. Do this in the same session that sees the merge.

1. Make sure that nothing is lost. `git status` must show no uncommitted changes, and
   `git log @{u}..` must show no unpushed commits. If you find either, or the branch has no
   upstream (then `git log @{u}..` fails), stop and keep the worktree. `git worktree remove`
   also deletes ignored files, such as a local `.env`. Copy any that you still need first.
2. From another checkout, run `git worktree remove <path>`. Do not add `--force`: it discards
   uncommitted work.
3. Confirm on GitHub that the pull request is merged. A successful `git branch -d` does not
   prove this. Then delete the local branch with `git branch -d <branch>`. A squash or rebase
   merge makes `-d` refuse. Use `git branch -D <branch>` only when the branch has no commits
   after the head commit of the merged pull request.
4. Run `git worktree prune --dry-run`. It lists records of worktree folders that no longer
   exist. If the list is correct, run `git worktree prune`. Use `git worktree lock` for a
   worktree on removable storage, so that prune keeps it.

Do not remove the main checkout. Do not remove a worktree that another session or person still
uses, or a worktree whose pull request is still open or was closed without a merge.
