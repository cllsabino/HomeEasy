function readArgument(argumentName) {
  const argumentIndex = process.argv.indexOf(`--${argumentName}`);
  return argumentIndex >= 0 ? process.argv[argumentIndex + 1] : "";
}

module.exports = { readArgument };
