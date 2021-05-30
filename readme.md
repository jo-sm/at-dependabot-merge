# at-dependabot-merge

A Github Actions action that allows you to automatically merge Dependabot PRs by creating a `@dependabot merge` comment on a successfully checked Dependabot PR whenever a workflow run finishes.

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
        uses: jo-sm/automerge-dependabot@v1
        with:
          run-id: ${{ github.event.workflow_run.id }}
          token: ${{ secrets.TOKEN_FOR_USER_WITH_PUSH_PERMS }}
```

This may look familar if you've seen [the Github blogpost about keeping your workflow actions secure](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/). In summary, the above workflow triggers on each completed workflow run, and runs the `jo-sm/automerge-dependabot` action when the workflow run was successful.

## Inputs

This action takes two inputs, `run-id` and `token`. Both inputs are required.

`run-id` is a workflow run ID. Generally this should be the `event.workflow_run.id` value. If you have multiple workflows for your PR, this action will wait until all are successful before making the comment.

`token` is an access token for a user who has push permissions for the repository. **Do not use the `GITHUB_TOKEN` token here**; the `GITHUB_TOKEN` user most likely won't have push permissions for your repo. You should either use a personal access token of your own, or use one from a bot account.

# Issues and pull requests

Something not working, or something missing for your use case? [Create an issue](https://github.com/jo-sm/automerge-dependabot/issues) and describe in detail your bug or feature request. [I also accept PRs](https://github.com/jo-sm/automerge-dependabot/compare) :-)

Please keep in mind that I won't accept fundamentally different functionality requests, such as adding the comment based on a different mechanism. If you need something that is fundamentally different, I recommend you to use a different action or a Github App to accomplish what you need.

# License

MIT
