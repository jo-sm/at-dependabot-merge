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
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
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
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
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
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
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
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
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
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "FAILURE",
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
                      },
                      {
                        status: "COMPLETED",
                        conclusion: "SUCCESS",
                      },
                      {
                        status: "PENDING",
                      },
                      {
                        status: "QUEUED",
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
