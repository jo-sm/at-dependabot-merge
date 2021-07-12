const { getOctokit } = require("@actions/github");
const action = require("./action");
const fixtures = require("./__fixtures__");

jest.mock("@actions/github", () => ({
  getOctokit: jest.fn(),
}));

const mockToken = "mock-token";
const mockOwner = "mock-owner";
const mockRepo = "mock-repo";
const mockRunId = "mock-run-id";

describe("action function", () => {
  let githubClient;
  let callAction;

  beforeEach(() => {
    githubClient = {
      rest: {
        actions: {
          getWorkflowRun: jest.fn(),
        },
        issues: {
          createComment: jest.fn(),
        },
      },
      graphql: jest.fn(),
    };

    getOctokit.mockReturnValue(githubClient);
    callAction = ({ onlySuccess } = { onlySuccess: false }) =>
      action(mockToken, mockOwner, mockRepo, mockRunId, { onlySuccess });
  });

  describe("workflow run request", () => {
    it("should throw if the getWorkflowRun request fails", async () => {
      const error = new Error("getWorkflowRun erred");

      githubClient.rest.actions.getWorkflowRun.mockRejectedValue(error);

      await expect(callAction()).rejects.toThrow(error);
      expect(githubClient.rest.actions.getWorkflowRun).toHaveBeenCalledWith({
        repo: mockRepo,
        owner: mockOwner,
        run_id: mockRunId,
      });
    });

    it("should return undefined if the run was not completed", async () => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.NOT_COMPLETED
      );

      await expect(callAction()).resolves.toBeUndefined();
    });

    it("should return undefined if the run was not successfully completed", async () => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.FAILURE
      );

      await expect(callAction()).resolves.toBeUndefined();
    });

    it("should return undefined if the run was skipped but onlySuccess is true", async () => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.SKIPPED
      );

      await expect(callAction({ onlySuccess: true })).resolves.toBeUndefined();
    });

    it("should throw if the workflow run had no PRs associated with it", async () => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.SUCCESS_NO_PRS
      );

      await expect(callAction()).rejects.toThrow(expect.any(Error));
    });

    it("should throw if the workflow run had more than 1 PRs associated with it", async () => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.SUCCESS_MULTIPLE_PRS
      );

      await expect(callAction()).rejects.toThrow(expect.any(Error));
    });
  });

  describe.each([
    { fixture: fixtures.getWorkflowRun.SUCCESS, title: "successful" },
    { fixture: fixtures.getWorkflowRun.SKIPPED, title: "skipped" },
  ])("with a $title workflow run request", ({ fixture }) => {
    beforeEach(() => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(fixture);
    });

    it("should throw if the GraphQL query fails", async () => {
      const error = new Error("graphql erred");

      githubClient.graphql.mockRejectedValue(error);

      await expect(callAction()).rejects.toThrow(error);
      expect(githubClient.graphql).toHaveBeenCalledWith(expect.any(String), {
        repo: mockRepo,
        owner: mockOwner,
        prNumber: fixtures.getWorkflowRun.SUCCESS.data.pull_requests[0].number,
      });
    });

    it("should return undefined if the PR creator is not dependabot", async () => {
      githubClient.graphql.mockResolvedValue(
        fixtures.graphql.SUCCESS_NOT_DEPENDABOT
      );

      await expect(callAction()).resolves.toBeUndefined();
    });

    it("should return undefined if all suites are not successfully completed", async () => {
      githubClient.graphql.mockResolvedValue(fixtures.graphql.PARTIAL_SUCCESS);

      await expect(callAction()).resolves.toBeUndefined();
    });

    it("should return undefined if all suites failed", async () => {
      githubClient.graphql.mockResolvedValue(fixtures.graphql.TOTAL_FAILURE);

      await expect(callAction()).resolves.toBeUndefined();
    });

    it("should return undefined if some suites were skipped and only successful suites are allowed", async () => {
      githubClient.graphql.mockResolvedValue(fixtures.graphql.SOME_SKIPPED);

      await expect(callAction({ onlySuccess: true })).resolves.toBeUndefined();
    });

    it("should return undefined if some suites were skipped and some failed", async () => {
      githubClient.graphql.mockResolvedValue(
        fixtures.graphql.SOME_SKIPPED_WITH_FAILURE
      );

      await expect(callAction()).resolves.toBeUndefined();
    });

    it("should return undefined if some suites are pending", async () => {
      githubClient.graphql.mockResolvedValue(
        fixtures.graphql.SOME_SUITES_NOT_COMPLETED
      );

      await expect(callAction()).resolves.toBeUndefined();
    });
  });

  describe.each([
    {
      title: "all successful suites",
      runFixture: fixtures.getWorkflowRun.SUCCESS,
      gqlFixture: fixtures.graphql.SUCCESS,
    },
    {
      // This wouldn't happen in reality - it can't be all successful in graphQL but skipped in the REST request - but
      // good to check anyway
      title: "skipped provided run and all successful suites",
      runFixture: fixtures.getWorkflowRun.SKIPPED,
      gqlFixture: fixtures.graphql.SUCCESS,
    },
    {
      title: "successful provided run and some skipped suites",
      runFixture: fixtures.getWorkflowRun.SUCCESS,
      gqlFixture: fixtures.graphql.SOME_SKIPPED,
    },
    {
      title: "provided run and some other suites are skipped",
      runFixture: fixtures.getWorkflowRun.SKIPPED,
      gqlFixture: fixtures.graphql.SOME_SKIPPED,
    },
  ])("with $title", ({ runFixture, gqlFixture }) => {
    beforeEach(() => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(runFixture);

      githubClient.graphql.mockResolvedValue(gqlFixture);
    });

    it("should throw if the createComment request fails", async () => {
      const error = new Error("createComment erred");

      githubClient.rest.issues.createComment.mockRejectedValue(error);

      await expect(callAction()).rejects.toThrow(error);
    });

    it("should create the expected comment and return true", async () => {
      githubClient.rest.issues.createComment.mockResolvedValue();

      await expect(callAction()).resolves.toBe(true);
      expect(githubClient.rest.issues.createComment).toHaveBeenCalledWith({
        repo: mockRepo,
        owner: mockOwner,
        issue_number:
          fixtures.getWorkflowRun.SUCCESS.data.pull_requests[0].number,
        body: "@dependabot merge",
      });
    });
  });
});
