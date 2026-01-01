import concurrently from "concurrently";

concurrently([
  {
    name: "server",
    command: "bun run dev",
    cwd: "server",
    prefixColor: "cyan",
  },
  {
    name: "client",
    command: "bun run dev",
    cwd: "client",
    prefixColor: "green",
  },
]);
