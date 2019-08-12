module.exports = function() {
  return {
    files: ["tsconfig.json", "src/**/*.ts", "!src/**/*.spec.ts"],
    tests: ["src/**/*.spec.ts"],
    testFramework: "jest",
    env: {
      type: "node",
      runner: "node",
    },
    debug: true,
  };
};
