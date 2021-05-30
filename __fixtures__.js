const fixtures = {
  getWorkflowRun: {
    SUCCESS: {
      data: {
        status: "completed",
        conclusion: "success",
        pull_requests: [
          {
            number: 7,
          },
        ],
      },
    },
    SUCCESS_MULTIPLE_PRS: {
      data: {
        status: "completed",
        conclusion: "success",
        pull_requests: [
          {
            number: 7,
          },
          {
            number: 20,
          },
          {
            number: -1,
          },
        ],
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
                        checkRuns: {
                          nodes: [
                            {
                              name: "some cool name",
                              conclusion: "SUCCESS",
                              status: "COMPLETED",
                            },
                          ],
                        },
                      },
                      {
                        checkRuns: {
                          nodes: [
                            {
                              name: "another cool name",
                              conclusion: "SUCCESS",
                              status: "COMPLETED",
                            },
                          ],
                        },
                      },
                      {
                        checkRuns: {
                          nodes: [
                            {
                              name: "third cool name",
                              conclusion: "SUCCESS",
                              status: "COMPLETED",
                            },
                            {
                              name: "third cool name, again",
                              conclusion: "SUCCESS",
                              status: "COMPLETED",
                            },
                          ],
                        },
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
                        checkRuns: {
                          nodes: [
                            {
                              name: "some cool name",
                              conclusion: "SUCCESS",
                              status: "COMPLETED",
                            },
                          ],
                        },
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
                        checkRuns: {
                          nodes: [
                            {
                              name: "some cool name",
                              conclusion: "SUCCESS",
                              status: "COMPLETED",
                            },
                          ],
                        },
                      },
                      {
                        checkRuns: {
                          nodes: [
                            {
                              name: "another cool name",
                              conclusion: "FAILURE",
                              status: "COMPLETED",
                            },
                          ],
                        },
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
                        checkRuns: {
                          nodes: [
                            {
                              name: "some cool name",
                              conclusion: "FAILURE",
                              status: "COMPLETED",
                            },
                          ],
                        },
                      },
                      {
                        checkRuns: {
                          nodes: [
                            {
                              name: "another cool name",
                              conclusion: "FAILURE",
                              status: "COMPLETED",
                            },
                          ],
                        },
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
