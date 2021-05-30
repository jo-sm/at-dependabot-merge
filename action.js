const createClient = require("./github-client");

async function action(token, owner, repo, runId) {
  const client = createClient(token, owner, repo);

  const run = await client.getWorkflowRun(runId);

  if (run.status !== "completed" || run.conclusion !== "success") {
    return;
  }

  // If the workflow is associated with a merged PR, the `pullRequests` array will be empty
  if (run.pullRequests.length !== 1) {
    throw new Error(
      `Workflow run ID ${runId} associated with ${run.pullRequests.length} PRs. Expected only 1. Make sure
      that the run ID provided is for a PR that is not merged.`
    );
  }

  const [{ number: prNumber }] = run.pullRequests;
  const { prCreatorUsername, prCreatorType, checks } =
    await client.getPRAndChecksDetails(prNumber);

  const userIsDependabot =
    prCreatorUsername.match(/^dependabot/) && prCreatorType === "Bot";

  if (!userIsDependabot) {
    return;
  }

  const shouldCreateComment = checks.reduce((memo, check) => {
    if (memo === false) {
      return false;
    }

    if (check.status !== "COMPLETED" || check.conclusion !== "SUCCESS") {
      return false;
    }

    return true;
  }, true);

  if (!shouldCreateComment) {
    return;
  }

  await client.createComment(prNumber, "@dependabot merge");

  return true;
}

module.exports = action;
