import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { CalldataEncodable } from "genlayer-js/types";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTEXTLOCK_CONTRACT_ADDRESS || "";

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
    const chainIdHex = "0x" + studionet.id.toString(16);

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: chainIdHex,
            chainName: studionet.name,
            rpcUrls: studionet.rpcUrls.default.http,
            nativeCurrency: studionet.nativeCurrency,
          }],
        });
      } else {
        throw switchError;
      }
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    }) as string[];

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

  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not available");
  }

  const client = createClient({
    chain: studionet,
    account: fromAddress as `0x${string}`,
    provider: window.ethereum,
  });

  const txHash = await client.writeContract({
    address: address as `0x${string}`,
    functionName: method,
    args: args as CalldataEncodable[],
    value: BigInt(0),
  });

  const receipt = await client.waitForTransactionReceipt({
    hash: txHash as `0x${string}` & { length: 66 },
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

  const client = createClient({ chain: studionet });

  const result = await client.readContract({
    address: address as `0x${string}`,
    functionName: method,
    args: args as CalldataEncodable[],
  });

  return typeof result === "string" ? result : JSON.stringify(result);
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      [key: string]: unknown;
    };
  }
}
