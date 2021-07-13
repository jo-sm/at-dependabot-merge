const fixtures = {
  getWorkflowRun: {
    NOT_COMPLETED: {
      data: {
        status: "queued",
        pull_requests: [{ number: 7 }],
      },
    },
    SUCCESS: {
      data: {
        status: "completed",
        conclusion: "success",
        pull_requests: [{ number: 7 }],
      },
    },
    SUCCESS_MULTIPLE_PRS: {
      data: {
        status: "completed",
        conclusion: "success",
        pull_requests: [{ number: 7 }, { number: 20 }, { number: -1 }],
      },
    },
    SUCCESS_NO_PRS: {
      data: {
        status: "completed",
        conclusion: "success",
        pull_requests: [],
      },
    },
    FAILURE: {
      data: {
        status: "completed",
        conclusion: "failure",
        pull_requests: [{ number: 7 }],
      },
    },
    SKIPPED: {
      data: {
        status: "completed",
        conclusion: "skipped",
        pull_requests: [{ number: 7 }],
      },
    },
  },
  graphql: {
    SUCCESS: {
      repository: {
        pullRequest: {
          author: {
            login: "dependabot",
            __typename: "Bot",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
    SUCCESS_NOT_DEPENDABOT: {
      repository: {
        pullRequest: {
          author: {
            login: "some-user",
            __typename: "User",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
    PARTIAL_SUCCESS: {
      repository: {
        pullRequest: {
          author: {
            login: "dependabot",
            __typename: "Bot",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
                        checkRuns: { totalCount: 1 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
    TOTAL_FAILURE: {
      repository: {
        pullRequest: {
          author: {
            login: "dependabot",
            __typename: "Bot",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
                        checkRuns: { totalCount: 1 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
    SOME_SKIPPED: {
      repository: {
        pullRequest: {
          author: {
            login: "dependabot",
            __typename: "Bot",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "SKIPPED",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
    SOME_SKIPPED_WITH_FAILURE: {
      repository: {
        pullRequest: {
          author: {
            login: "dependabot",
            __typename: "Bot",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "SKIPPED",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
                        checkRuns: { totalCount: 1 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
    SOME_SUITES_NOT_COMPLETED: {
      repository: {
        pullRequest: {
          author: {
            login: "dependabot",
            __typename: "Bot",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "PENDING",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "QUEUED",
                        checkRuns: { totalCount: 1 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
    SOME_NO_CHECK_RUNS: {
      repository: {
        pullRequest: {
          author: {
            login: "dependabot",
            __typename: "Bot",
          },
          commits: {
            nodes: [
              {
                commit: {
                  checkSuites: {
                    nodes: [
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "QUEUED",
                        checkRuns: { totalCount: 0 },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = fixtures;
