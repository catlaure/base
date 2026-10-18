import { createPublicClient, formatUnits, http, isAddress, type Address } from "viem";
import { baseSepolia } from "viem/chains";
import { tokenAbi } from "../abi.js";
import type { Config } from "../config.js";

export async function balance(config: Config, holder: string): Promise<string> {
  if (!isAddress(holder)) {
    throw new Error(`"${holder}" is not a valid address`);
  }

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });

  const contract = { address: config.tokenAddress as Address, abi: tokenAbi } as const;
  const [raw, decimals, symbol] = await Promise.all([
    client.readContract({ ...contract, functionName: "balanceOf", args: [holder] }),
    client.readContract({ ...contract, functionName: "decimals" }),
    client.readContract({ ...contract, functionName: "symbol" }),
  ]);

  return `${formatUnits(raw, decimals)} ${symbol}`;
}
