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
    callAction = action.bind(null, mockToken, mockOwner, mockRepo, mockRunId);
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

    it("should return undefined if the run was not successfully completed", async () => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.FAILURE
      );

      await expect(callAction()).resolves.toBeUndefined();
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

  describe("with successful workflow run request", () => {
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

    it("should return undefined if all checks are not successfully completed", async () => {
      githubClient.graphql.mockResolvedValue(fixtures.graphql.PARTIAL_SUCCESS);

      await expect(callAction()).resolves.toBeUndefined();
    });

    it("should return undefined if all checks failed", async () => {
      githubClient.graphql.mockResolvedValue(fixtures.graphql.TOTAL_FAILURE);

      await expect(callAction()).resolves.toBeUndefined();
    });
  });

  describe("with all successful checks", () => {
    beforeEach(() => {
      githubClient.rest.actions.getWorkflowRun.mockResolvedValue(
        fixtures.getWorkflowRun.SUCCESS
      );

      githubClient.graphql.mockResolvedValue(fixtures.graphql.SUCCESS);
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
