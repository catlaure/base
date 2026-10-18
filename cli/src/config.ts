import { isAddress, type Address } from "viem";

export interface Config {
  rpcUrl: string;
  tokenAddress: Address;
  privateKey?: `0x${string}`;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const rpcUrl = env.RPC_URL ?? "https://sepolia.base.org";
  const tokenAddress = env.TOKEN_ADDRESS;

  if (!tokenAddress || !isAddress(tokenAddress)) {
    throw new Error("TOKEN_ADDRESS is missing or is not a valid address");
  }

  const rawKey = env.PRIVATE_KEY?.trim();
  let privateKey: `0x${string}` | undefined;
  if (rawKey) {
    const prefixed = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(prefixed)) {
      throw new Error("PRIVATE_KEY must be 32 bytes of hex");
    }
    privateKey = prefixed as `0x${string}`;
  }

  return { rpcUrl, tokenAddress, privateKey };
}
