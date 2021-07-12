const createClient = require("./github-client");
const { getOctokit } = require("@actions/github");
const fixtures = require("./__fixtures__");

jest.mock("@actions/github", () => ({
  getOctokit: jest.fn(),
}));

const mockToken = "mock-token";
const mockOwner = "mock-owner";
const mockRepo = "mock-repo";

describe("github-client", () => {
  beforeEach(() => {
    const client = {
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

    getOctokit.mockReturnValue(client);
  });

  it("should return a wrapper around the Github client", () => {
    const client = createClient(mockToken, mockOwner, mockRepo);

    expect(getOctokit).toHaveBeenCalledWith(mockToken);
    expect(client).toStrictEqual({
      getWorkflowRun: expect.any(Function),
      getPRAndChecksDetails: expect.any(Function),
      createComment: expect.any(Function),
    });
  });

  describe("with client", () => {
    let githubClient;
    let client;

    beforeEach(() => {
      githubClient = getOctokit();
      client = createClient(mockToken, mockOwner, mockRepo);
    });

    describe("getWorkflowRun", () => {
      it("should resolve the expected shape of data", async () => {
        const response = fixtures.getWorkflowRun.SUCCESS_MULTIPLE_PRS;

        githubClient.rest.actions.getWorkflowRun.mockResolvedValue(response);

        expect(await client.getWorkflowRun("mock-run-id")).toStrictEqual({
          status: response.data.status,
          conclusion: response.data.conclusion,
          pullRequests: [
            { number: response.data.pull_requests[0].number },
            { number: response.data.pull_requests[1].number },
            { number: response.data.pull_requests[2].number },
          ],
        });

        expect(githubClient.rest.actions.getWorkflowRun).toHaveBeenCalledWith({
          owner: mockOwner,
          repo: mockRepo,
          run_id: "mock-run-id",
        });
      });
    });

    describe("getPRAndChecksDetails", () => {
      it("should resolve the expected shape of data", async () => {
        const response = fixtures.graphql.SUCCESS;

        githubClient.graphql.mockResolvedValue(response);

        expect(await client.getPRAndChecksDetails("1234")).toStrictEqual({
          prCreatorUsername: response.repository.pullRequest.author.login,
          prCreatorType: response.repository.pullRequest.author.__typename,
          checkSuites:
            response.repository.pullRequest.commits.nodes[0].commit.checkSuites
              .nodes,
        });

        expect(githubClient.graphql).toHaveBeenCalledWith(expect.any(String), {
          repo: mockRepo,
          owner: mockOwner,
          prNumber: "1234",
        });
      });
    });

    describe("createComment", () => {
      it("should resolve true, regardless of response", async () => {
        githubClient.rest.issues.createComment.mockResolvedValue({
          data: "some data value",
        });

        expect(
          await client.createComment("5678", "a comment body")
        ).toStrictEqual(true);
        expect(githubClient.rest.issues.createComment).toHaveBeenCalledWith({
          repo: mockRepo,
          owner: mockOwner,
          issue_number: "5678",
          body: "a comment body",
        });
      });
    });
  });
});
