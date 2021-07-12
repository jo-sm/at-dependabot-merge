const createClient = require("./github-client");

async function action(token, owner, repo, runId, { onlySuccess }) {
  const client = createClient(token, owner, repo);

  const run = await client.getWorkflowRun(runId);

  if (run.status !== "completed") {
    return;
  }

  if (onlySuccess && !["success"].includes(run.conclusion)) {
    return;
  }

  if (!["success", "skipped"].includes(run.conclusion)) {
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
  const { prCreatorUsername, prCreatorType, checkSuites } =
    await client.getPRAndChecksDetails(prNumber);

  const userIsDependabot =
    prCreatorUsername.match(/^dependabot/) && prCreatorType === "Bot";

  if (!userIsDependabot) {
    return;
  }

  const shouldCreateComment = checkSuites.reduce((memo, suite) => {
    if (memo === false) {
      return false;
    }

    if (suite.status !== "COMPLETED") {
      return false;
    }

    // Allow skipped workflows if the user didn't explicitly require only successful workflows
    if (suite.conclusion === "SKIPPED" && !onlySuccess) {
      return true;
    }

    // Otherwise only allow successful workflows
    if (suite.conclusion === "SUCCESS") {
      return true;
    }

    return false;
  }, true);

  if (!shouldCreateComment) {
    return;
  }

  await client.createComment(prNumber, "@dependabot merge");

  return true;
}

module.exports = action;
