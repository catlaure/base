#!/usr/bin/env node
import { loadConfig } from "./config.js";
import { balance } from "./commands/balance.js";
import { transfer } from "./commands/transfer.js";

const USAGE = `Usage:
  bgt balance <address>
  bgt transfer <to> <amount>
`;

async function main(argv: string[]): Promise<void> {
  const [command, ...args] = argv;

  switch (command) {
    case "balance": {
      if (args.length !== 1) throw new Error("balance needs exactly one <address>");
      console.log(await balance(loadConfig(), args[0]));
      break;
    }
    case "transfer": {
      if (args.length !== 2) throw new Error("transfer needs <to> and <amount>");
      const hash = await transfer(loadConfig(), args[0], args[1]);
      console.log(`Confirmed: ${hash}`);
      break;
    }
    default:
      console.log(USAGE);
      process.exitCode = command ? 1 : 0;
  }
}

main(process.argv.slice(2)).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
