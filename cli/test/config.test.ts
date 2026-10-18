import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

const ADDRESS = "0x1111111111111111111111111111111111111111";
const KEY = "0x" + "ab".repeat(32);

describe("loadConfig", () => {
  it("uses Base Sepolia RPC by default", () => {
    const config = loadConfig({ TOKEN_ADDRESS: ADDRESS });
    expect(config.rpcUrl).toBe("https://sepolia.base.org");
    expect(config.privateKey).toBeUndefined();
  });

  it("respects RPC_URL override", () => {
    const config = loadConfig({ TOKEN_ADDRESS: ADDRESS, RPC_URL: "http://localhost:8545" });
    expect(config.rpcUrl).toBe("http://localhost:8545");
  });

  it("throws when TOKEN_ADDRESS is missing", () => {
    expect(() => loadConfig({})).toThrow(/TOKEN_ADDRESS/);
  });

  it("throws when TOKEN_ADDRESS is invalid", () => {
    expect(() => loadConfig({ TOKEN_ADDRESS: "0x123" })).toThrow(/TOKEN_ADDRESS/);
  });

  it("accepts a private key with or without 0x prefix", () => {
    expect(loadConfig({ TOKEN_ADDRESS: ADDRESS, PRIVATE_KEY: KEY }).privateKey).toBe(KEY);
    expect(loadConfig({ TOKEN_ADDRESS: ADDRESS, PRIVATE_KEY: KEY.slice(2) }).privateKey).toBe(KEY);
  });

  it("rejects a malformed private key", () => {
    expect(() => loadConfig({ TOKEN_ADDRESS: ADDRESS, PRIVATE_KEY: "0xdead" })).toThrow(/PRIVATE_KEY/);
  });
});
