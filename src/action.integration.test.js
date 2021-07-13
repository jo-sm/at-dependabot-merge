const action = require("./action");

const GITHUB_TOKEN = global.process.env["GITHUB_TOKEN"];

describe("Action integration test", () => {
  let callAction;

  beforeEach(() => {
    callAction = (owner, repo, runId) =>
      action(GITHUB_TOKEN, owner, repo, runId, {
        __integrationTest: true,
      });
  });

  it("should return true for a successful PR", async () => {
    // Known PR with all passing but bad data from API. This should be considered successful for now
    await expect(
      callAction("jo-sm", "stylelint_d", "1025325797")
    ).resolves.toBe(true);
  });

  it("should return undefined for a failed PR", async () => {
    await expect(
      callAction("jo-sm", "at-dependabot-merge", "1026239265")
    ).resolves.toBeUndefined();
  });
});
