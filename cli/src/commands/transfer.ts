import {
  createPublicClient,
  createWalletClient,
  http,
  isAddress,
  parseUnits,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { tokenAbi } from "../abi.js";
import type { Config } from "../config.js";

export async function transfer(config: Config, to: string, amount: string): Promise<string> {
  if (!config.privateKey) {
    throw new Error("PRIVATE_KEY must be set to send a transfer");
  }
  if (!isAddress(to)) {
    throw new Error(`"${to}" is not a valid address`);
  }

  const transport = http(config.rpcUrl);
  const publicClient = createPublicClient({ chain: baseSepolia, transport });
  const walletClient = createWalletClient({
    account: privateKeyToAccount(config.privateKey),
    chain: baseSepolia,
    transport,
  });

  const address = config.tokenAddress as Address;
  const decimals = await publicClient.readContract({ address, abi: tokenAbi, functionName: "decimals" });
  const value = parseUnits(amount, decimals);

  const hash = await walletClient.writeContract({
    address,
    abi: tokenAbi,
    functionName: "transfer",
    args: [to, value],
  });
  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}
