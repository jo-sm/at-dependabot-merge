const core = require("@actions/core");
const { context } = require("@actions/github");
const action = require("./action");

const token = core.getInput("token");
const runId = parseInt(core.getInput("run-id"), 10);

// If any value is given here, treat it as true. If it's not provided it'll be an empty string.
const onlyGivenRun = core.getInput("only-given-run") === "" ? false : true;
const onlySuccess = core.getInput("only-success") === "" ? false : true;

const { owner, repo } = context.repo;

action(token, owner, repo, runId, { onlySuccess, onlyGivenRun }).catch((e) => {
  core.error(e);
  core.setFailed(e.message);
});
