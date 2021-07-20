const createClient = require("./github-client");

async function action(
  token,
  owner,
  repo,
  runId,
  // Right now, I don't have a failing Dependabot PR in one of my repos. Once I do, I don't need special cases
  // for the integration test (which is an antipattern).
  { onlySuccess = false, onlyGivenRun = false, __integrationTest = false }
) {
  const client = createClient(token, owner, repo);

  const run = await client.getWorkflowRun(runId);

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
    // We allow the integration test to bypass this check, since we can't simulate a dependabot PR
    (prCreatorUsername.match(/^dependabot/) && prCreatorType === "Bot") ||
    __integrationTest;

  if (!userIsDependabot) {
    return;
  }

  const shouldCreateComment = checkSuites
    .filter((suite) => {
      if (onlyGivenRun) {
        return suite.workflowRun.databaseId === runId;
      }

      return true;
    })
    .reduce((memo, suite) => {
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

  if (!__integrationTest) {
    await client.createComment(prNumber, "@dependabot merge");
  }

  return true;
}

module.exports = action;
