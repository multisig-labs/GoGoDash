import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@tremor/react/dist/esm/tremor.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Chain } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { GoGoProvider } from "../components/gogoProvider";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const avalancheChain: Chain = {
  id: 43_114,
  name: "Avalanche",
  network: "avalanche",
  // iconUrl: "https://example.com/icon.svg",
  // iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: {
      http: ["https://api.avax.network/ext/bc/C/rpc"],
    },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};

const { chains, provider, webSocketProvider } = configureChains(
  [avalancheChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "GoGoTools",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <GoGoProvider>
          <Component {...pageProps} />
        </GoGoProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
