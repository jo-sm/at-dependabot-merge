const { getOctokit } = require("@actions/github");
const action = require("./action");
const fixtures = require("./__fixtures__");

jest.mock("@actions/github", () => ({
  getOctokit: jest.fn(),
}));

const mockToken = "mock-token";
const mockOwner = "mock-owner";
const mockRepo = "mock-repo";
const mockRunId = fixtures.MOCK_RUN_ID;

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
    callAction = (
      { onlySuccess, onlyGivenRun } = {
        onlySuccess: false,
        onlyGivenRun: false,
      }
    ) =>
      action(mockToken, mockOwner, mockRepo, mockRunId, {
        onlySuccess,
        onlyGivenRun,
      });
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

  describe("with a successful workflow run request", () => {
    beforeEach(() => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.SUCCESS
      );
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

    it("should return undefined if all suites are missing workflow run data and onlyGivenRun is true", async () => {
      githubClient.graphql.mockResolvedValue(
        fixtures.graphql.ALL_WORKFLOW_RUN_DATA_MISSING
      );

      await expect(callAction({ onlyGivenRun: true })).resolves.toBeUndefined();
    });
  });

  describe.each([
    {
      title: "all successful suites",
      gqlFixture: fixtures.graphql.SUCCESS,
      actionArgs: {},
    },
    {
      title: "some skipped suites",
      gqlFixture: fixtures.graphql.SOME_SKIPPED,
      actionArgs: {},
    },
    {
      title: "weird suite data",
      gqlFixture: fixtures.graphql.SOME_NO_CHECK_RUNS,
      actionArgs: {},
    },
    {
      title:
        "only the given run id is successful but that is the only one cared about",
      gqlFixture: fixtures.graphql.SOME_FAILURE_WITH_KNOWN_WORKFLOW_RUN_ID,
      actionArgs: { onlyGivenRun: true },
    },
    {
      title:
        "only the given run ID is successful and other check suites are missing workflow data",
      gqlFixture: fixtures.graphql.SOME_WORKFLOW_RUN_MISSING_BUT_SUCCESSFUL,
      actionArgs: { onlyGivenRun: true },
    },
  ])("with $title", ({ gqlFixture, actionArgs }) => {
    beforeEach(() => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.SUCCESS
      );
      githubClient.graphql.mockResolvedValue(gqlFixture);
    });

    it("should throw if the createComment request fails", async () => {
      const error = new Error("createComment erred");

      githubClient.rest.issues.createComment.mockRejectedValue(error);

      await expect(callAction(actionArgs)).rejects.toThrow(error);
    });

    it("should create the expected comment and return true", async () => {
      githubClient.rest.issues.createComment.mockResolvedValue();

      await expect(callAction(actionArgs)).resolves.toBe(true);
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
