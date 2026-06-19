import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { CalldataEncodable, TransactionStatus } from "genlayer-js/types";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTEXTLOCK_CONTRACT_ADDRESS || "";

let glClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!glClient) {
    glClient = createClient({ chain: studionet });
  }
  return glClient;
}

export function getContractAddress(): string {
  return CONTRACT_ADDRESS;
}

export function getGenLayerChainConfig() {
  return {
    chainId: studionet.id,
    chainName: studionet.name,
    rpcUrl: studionet.rpcUrls.default.http[0],
    nativeCurrency: studionet.nativeCurrency,
  };
}

export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;

  try {
    const client = createClient({
      chain: studionet,
      provider: window.ethereum as EthereumProvider,
    });

    await client.connect("studionet");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    }) as string[];

    if (accounts[0]) {
      glClient = createClient({
        chain: studionet,
        account: accounts[0] as `0x${string}`,
        provider: window.ethereum as EthereumProvider,
      });
    }

    return accounts[0] || null;
  } catch (e) {
    console.error("Wallet connection failed:", e);
    return null;
  }
}

export async function callContractWrite(
  fromAddress: string,
  method: string,
  args: unknown[]
): Promise<string> {
  const address = getContractAddress();
  if (!address) throw new Error("Contract address not configured");

  const client = createClient({
    chain: studionet,
    account: fromAddress as `0x${string}`,
    provider: typeof window !== "undefined" ? window.ethereum as EthereumProvider : undefined,
  });

  await client.connect("studionet");

  const txHash = await client.writeContract({
    address: address as `0x${string}`,
    functionName: method,
    args: args as CalldataEncodable[],
    value: BigInt(0),
  });

  const receipt = await client.waitForTransactionReceipt({
    hash: txHash as `0x${string}` & { length: 66 },
    status: "FINALIZED" as TransactionStatus,
    interval: 5000,
    retries: 60,
  });

  if (!receipt) {
    throw new Error("Transaction timed out waiting for receipt");
  }

  return txHash;
}

export async function callContractRead(method: string, args: unknown[]): Promise<string> {
  const address = getContractAddress();
  if (!address) throw new Error("Contract address not configured");

  const client = getClient();

  const result = await client.readContract({
    address: address as `0x${string}`,
    functionName: method,
    args: args as CalldataEncodable[],
  });

  return typeof result === "string" ? result : JSON.stringify(result);
}

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
