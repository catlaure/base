import { describe, expect, it } from "vitest";
import { balance } from "../src/commands/balance.js";
import { transfer } from "../src/commands/transfer.js";
import type { Config } from "../src/config.js";

const base: Config = {
  rpcUrl: "http://127.0.0.1:1",
  tokenAddress: "0x1111111111111111111111111111111111111111",
};

describe("balance", () => {
  it("rejects an invalid holder address before touching the network", async () => {
    await expect(balance(base, "not-an-address")).rejects.toThrow(/not a valid address/);
  });
});

describe("transfer", () => {
  it("requires a private key", async () => {
    await expect(transfer(base, "0x2222222222222222222222222222222222222222", "1")).rejects.toThrow(
      /PRIVATE_KEY/,
    );
  });

  it("rejects an invalid recipient address", async () => {
    const withKey: Config = { ...base, privateKey: `0x${"ab".repeat(32)}` };
    await expect(transfer(withKey, "nope", "1")).rejects.toThrow(/not a valid address/);
  });
});
