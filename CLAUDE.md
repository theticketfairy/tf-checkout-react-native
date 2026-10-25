# tf-checkout-react-native — development rules

Application source stays in this repository. Shared end-to-end tests belong in
[automated-testing](https://github.com/theticketfairy/automated-testing).

The central repository is private; its policy links require authorised GitHub access.

## E2E user journeys must be agent-driven

All application E2E journeys must use TesterArmy agents in
[theticketfairy/automated-testing](https://github.com/theticketfairy/automated-testing).
The agent uses natural-language tasks and fresh browser/native observations to
choose and perform the user's actions. This is required for existing and new
journeys on web, iOS, Android and macOS, including event pages and checkout.

- Do not author CSS, XPath, DOM-ID, role/label locator scripts, fixed-coordinate
  clicks or JavaScript DOM interaction for application journeys. Do not hide such
  scripts in helpers or project tools, or add an agent call around them and call
  the result agent-driven. The framework's own observation/action engine may
  resolve live element references; application tests must not maintain selectors.
- Keep exact outcome checks: API/provider responses, persisted order/ticket and
  inventory state, payment destinations, application fees, client proceeds,
  duplicate economic effects and lifecycle history. An agent's claim or a
  confirmation page cannot replace these authoritative assertions.
- Keep deterministic request/tenant guards, sandbox verification, isolated test
  fixtures, fault injection and concurrency orchestration. They constrain and
  verify the agent; a prompt alone is not a permission or payment safety boundary.
- Missing model credentials, accounts, builds or fixtures fail acceptance. Never
  fall back to selector scripts or report a skipped/unexecuted journey as passed.
  Converted journeys require new agent-driven runs; earlier selector-run evidence
  remains historical and must not be relabelled as agent-driven acceptance.
- Unit/component tests, protocol checks and runner/guard contract tests may remain
  deterministic as supporting checks. They do not replace or count as agent-driven
  application E2E acceptance.
- Functionality changes must push actual executable agent-driven journeys to the
  central repository in the same body of work, with linked PRs, guide/help claims
  and run artifacts. Local results alone do not meet this rule.

See the central [E2E policy](https://github.com/theticketfairy/automated-testing/blob/main/docs/E2E_POLICY.md).

## Merge central tests after source merge

For app changes, push executable central tests and link all source PRs. They must be merged into
`master`/`main` before merging or enabling auto-merge. For tests of code already there, record its revision;
no new source PR is needed. Run affected real-agent journeys locally on current central PR code; record
passing commands/results/artifacts, app/suite revisions and fixture/model/device scope. Only then merge
automatically (normal merge or auto-merge), with no separate permission request. GitHub-required
reviews/checks still apply; never bypass protections. Failed, skipped, unrun, stale or harness-only UI
results do not qualify. Docs/infra-only PRs need justified focused local checks, no source PR or new UI test.
App PR merge rules stay separate.
