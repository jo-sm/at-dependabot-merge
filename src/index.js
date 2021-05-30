const core = require("@actions/core");
const { context } = require("@actions/github");
const action = require("./action");

const token = core.getInput("token");
const runId = core.getInput("run-id");

const { owner, repo } = context.repo;

action(token, owner, repo, runId).catch((e) => {
  core.error(e);
  core.setFailed(e.message);
});
