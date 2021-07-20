function generateRandomId(length = 16) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const result = [];

  while (length > 0) {
    result.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    length--;
  }

  return result.join("");
}

const MOCK_RUN_ID = "mock-run-id";

const fixtures = {
  MOCK_RUN_ID,
  getWorkflowRun: {
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "FAILURE",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SKIPPED",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SKIPPED",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "PENDING",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
    SOME_FAILURE_WITH_KNOWN_WORKFLOW_RUN_ID: {
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
                        workflowRun: {
                          databaseId: MOCK_RUN_ID,
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
                        status: "COMPLETED",
                        conclusion: "FAILURE",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        workflowRun: {
                          databaseId: generateRandomId(),
                        },
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
    SOME_WORKFLOW_RUN_MISSING_BUT_SUCCESSFUL: {
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
                        workflowRun: {
                          databaseId: MOCK_RUN_ID,
                        },
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                        checkRuns: { totalCount: 1 },
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
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
    ALL_WORKFLOW_RUN_DATA_MISSING: {
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
