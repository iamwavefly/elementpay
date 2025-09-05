import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum, base, sepolia } from "wagmi/chains";
import { env } from "./env";

export const config = getDefaultConfig({
  appName: "ElementPay",
  projectId: env.WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, polygon, arbitrum, base, sepolia],
  ssr: true,
});
