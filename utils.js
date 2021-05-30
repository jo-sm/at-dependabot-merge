function shallowFlatten(arrs) {
  const result = [];

  for (const arr of arrs) {
    result.push(...arr);
  }

  return result;
}

module.exports = {
  shallowFlatten,
};
