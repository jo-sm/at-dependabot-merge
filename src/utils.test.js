const utils = require("./utils");

describe("utils", () => {
  describe("shallowFlatten", () => {
    it("should flatten an array of arrays", () => {
      expect(
        utils.shallowFlatten([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8],
        ])
      ).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should only shallowly flatten", () => {
      expect(utils.shallowFlatten([[[1, 2, 3]]])).toStrictEqual([[1, 2, 3]]);
    });

    it("should only use the first argument", () => {
      expect(
        utils.shallowFlatten([[1, 2, 3], [4, 5], [[6, 7]]], [[8, 9]])
      ).toStrictEqual([1, 2, 3, 4, 5, [6, 7]]);
    });
  });
});
