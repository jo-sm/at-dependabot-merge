# at-dependabot-merge

A Github Actions action that allows you to automatically merge Dependabot PRs by creating a `@dependabot merge` comment on a successfully checked Dependabot PR whenever a specific workflow run finishes.

# Usage

Basic usage:

```yaml
name: Add comment to successful Dependabot PRs

on:
  workflow_run:
    workflows: ["My workflow name"]
    types:
      - completed

jobs:
  add-dependabot-comment:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.event == 'pull_request' && github.event.workflow_run.conclusion == 'success' }}
    steps:
      # ... some steps before
      - name: Add merge comment for dependabot PRs
        uses: jo-sm/at-dependabot-merge@v1.1
        with:
          run-id: ${{ github.event.workflow_run.id }}
          token: ${{ secrets.TOKEN_FOR_USER_WITH_PUSH_PERMS }}
```

This may look familar if you've seen [the Github blogpost about keeping your workflow actions secure](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/). In summary, the above workflow triggers on each completed workflow run, and runs the `jo-sm/at-dependabot-merge` action when the workflow run was successful.

## How it works

The action works like this:

1. For the provided `run-id`, ensure the associated workflow is completed and successful or skipped.
2. Get the PR associated with the `run-id`.
3. For this PR, ensure that the author is `dependabot`.
4. For this PR, ensure that all workflow runs are successful or skipped.

   To only allow successful workflow runs, you can provide `only-success: "true"` to the job.

5. Once all of the above are okay, then a `@dependabot merge` commit is created by the user associated with `token`.

   **NOTE**: This user must have write/push permissions to the repository. **Do not use the `secrets.GITHUB_TOKEN` access token!** Instead use a bot account or your own personal access token.

## Inputs

This action has required two inputs, `run-id` and `token`, and one optional input, `only-success`.

`run-id` is a workflow run ID. Generally this should be the `event.workflow_run.id` value. If you have multiple workflows for your PR, this action will wait until all workflows are successful before making the comment.

`token` is an access token for a user who has push permissions for the repository. **Do not use the `secrets.GITHUB_TOKEN` token here**; the `GITHUB_TOKEN` user won't have push permissions for your repo. You should either use a personal access token of your own, or use one from a bot account.

`only-success` is an optional input that allows you to require all workflow runs to be successful. By default, skipped workflow runs are ignored and this option allows you to restrict this.

## Skipping action when the PR isn't by Dependabot

This action [automatically detects when the PR is not Dependabot and skips adding a comment](https://github.com/jo-sm/at-dependabot-merge/blob/2096326539ad22ecd157850115385ef8885d95fd/src/action.js#L24-L29) in this case. However, this requires that the action still runs first, which isn't ideal in all situations.

To prevent the action from even being able to run if the user isn't Dependabot, you can modify a relevant `if` condition to support it:

```yaml
jobs:
  add-dependabot-comment:
    # ...
    if: ${{ github.event.workflow_run.event == 'pull_request' && github.event.workflow_run.conclusion == 'success' && github.actor == 'dependabot[bot]' }}
    steps:
      # ...
      - name: Add merge comment for dependabot PRs
        uses: jo-sm/at-dependabot-merge@v1.1
        with:
          run-id: # ...
          token: # ...
```

This works identically if you want to have the `if` condition inside of the `step`, rather than the `job`.

For more details about the `if` syntax, checkout the Github docs for [`jobs.<job_id>.if`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif) and [`jobs.<job_id>.steps[*].if`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif).

# Development

## Running tests

The test suites are run using Jest, and you can run it using `npm test`. To run in watch mode, you can run `npm run test:watch`.

### Integration test

There is an integration test suite that runs against real runs and uses the Github API. This test expects the `GITHUB_TOKEN` environment variable to be available:

```
export GITHUB_TOKEN="..."
npm run test:watch
```

# Issues and pull requests

Something not working, or something missing for your use case? [Create an issue](https://github.com/jo-sm/automerge-dependabot/issues) and describe in detail your bug or feature request. [I also accept PRs](https://github.com/jo-sm/automerge-dependabot/compare) :-)

Please keep in mind that I won't accept fundamentally different functionality requests, such as adding the comment based on a different mechanism. If you need something that is fundamentally different, I recommend you to use a different action or a Github App to accomplish what you need.

# License

MIT
