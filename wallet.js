import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
  WagmiCore,
  WagmiCoreChains,
  WagmiCoreConnectors
} from "https://unpkg.com/@web3modal/ethereum@2.6.2";

import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.6.2";

// ✅ Pull out all needed chains from WagmiCoreChains
const {
  mainnet,          // Ethereum Mainnet
  bsc,              // BNB Smart Chain
  polygon,          // Polygon POS
  polygonZkEvm,     // Polygon zkEVM
  arbitrum,         // Arbitrum One
  optimism,         // Optimism Mainnet
  base,             // Coinbase Base L2
  avalanche,        // Avalanche C-Chain
  fantom,           // Fantom Opera
  mantle,           // Mantle Network
  cronos,           // Cronos Chain (Crypto.com EVM)
  kcc,              // KuCoin Community Chain
  opBNB             // Binance opBNB (Optimism L2 on BNB)
} = WagmiCoreChains;

// ✅ Your WalletConnect Cloud Project ID
const projectId = "685604db11bce85e357332363ed2a81f";

// 1. Define supported chains (all EVM)
const chains = [
  mainnet,
  bsc,
  polygon,
  polygonZkEvm,
  arbitrum,
  optimism,
  base,
  avalanche,
  fantom,
  mantle,
  cronos,
  kcc,
  opBNB
];

// 2. Configure wagmi client
const { configureChains, createConfig } = WagmiCore;
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ chains, version: 2, projectId }),
    new WagmiCoreConnectors.CoinbaseWalletConnector({
      chains,
      options: { appName: "Multi-chain WalletConnect Example" }
    })
  ],
  publicClient
});

// 3. Create ethereum client + modal
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3Modal = new Web3Modal(
  {
    projectId,
    themeMode: "light",
    themeVariables: {
      "--w3m-accent-color": "#4cafef"
    }
  },
  ethereumClient
);

// 4. Connect button
document.getElementById("connectButton").addEventListener("click", () => {
  web3Modal.openModal();
});
