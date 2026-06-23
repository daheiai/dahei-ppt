const [, , command] = process.argv;

if (!command || command === "--help" || command === "-h") {
  console.log("dahei-ppt CLI");
  console.log("");
  console.log("Commands will be added as the Studio v1 workflow is implemented.");
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
process.exit(1);
