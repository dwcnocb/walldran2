import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
  WagmiCore,
  WagmiCoreChains,
  WagmiCoreConnectors
} from "https://unpkg.com/@web3modal/ethereum@2.6.2";

import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.6.2";

// --- Setup Wagmi + Chains ---
const { bsc } = WagmiCoreChains;
const { configureChains, createConfig } = WagmiCore;

// ✅ Your WalletConnect Project ID
const projectId = "685604db11bce85e357332363ed2a81f";

// 1. Define chains
const chains = [bsc];

// 2. Configure wagmi client
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ chains, version: 2, projectId }),
    new WagmiCoreConnectors.CoinbaseWalletConnector({
      chains,
      options: { appName: "WalletConnect Example" }
    })
  ],
  publicClient
});

// 3. Create ethereum + modal client
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3Modal = new Web3Modal(
  {
    projectId,
    themeMode: "light",
    themeVariables: {
      "--w3m-accent-color": "#4cafef",
      "--w3m-background-color": "#ffffff"
    }
  },
  ethereumClient
);

// 4. Hook up button
document.getElementById("connectButton").addEventListener("click", () => {
  web3Modal.openModal();
});

