const GENLAYER_RPC_URL = process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com:8443/api";
const GENLAYER_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID || "61999", 10);
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTEXTLOCK_CONTRACT_ADDRESS || "";

export function getGenLayerChainConfig() {
  return {
    chainId: GENLAYER_CHAIN_ID,
    chainName: "GenLayer Simulator",
    rpcUrl: GENLAYER_RPC_URL,
    nativeCurrency: {
      name: "GEN",
      symbol: "GEN",
      decimals: 18,
    },
  };
}

export function getContractAddress(): string {
  return CONTRACT_ADDRESS;
}

export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;

  try {
    const chainIdHex = "0x" + GENLAYER_CHAIN_ID.toString(16);

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        const config = getGenLayerChainConfig();
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: chainIdHex,
            chainName: config.chainName,
            rpcUrls: [config.rpcUrl],
            nativeCurrency: config.nativeCurrency,
          }],
        });
      }
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    }) as string[];

    return accounts[0] || null;
  } catch {
    return null;
  }
}

async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(GENLAYER_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }),
  });

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error.message || JSON.stringify(result.error));
  }
  return result.result;
}

export async function callContractWrite(
  fromAddress: string,
  method: string,
  args: unknown[]
): Promise<string> {
  const address = getContractAddress();
  if (!address) throw new Error("Contract address not configured");

  const txHash = await rpcCall("eth_sendTransaction", [{
    from: fromAddress,
    to: address,
    data: {
      function_name: method,
      function_args: args,
    },
  }]) as string;

  // Wait for transaction to be processed
  let receipt = null;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      receipt = await rpcCall("eth_getTransactionReceipt", [txHash]);
      if (receipt) break;
    } catch {
      // Transaction still pending
    }
  }

  if (!receipt) {
    throw new Error("Transaction timed out waiting for receipt");
  }

  return txHash;
}

export async function callContractRead(method: string, args: unknown[]): Promise<string> {
  const address = getContractAddress();
  if (!address) throw new Error("Contract address not configured");

  const result = await rpcCall("eth_call", [{
    to: address,
    data: {
      function_name: method,
      function_args: args,
    },
  }, "latest"]);

  return result as string;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
