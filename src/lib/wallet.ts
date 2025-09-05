import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum, base, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "ElementPay",
  projectId: "element-pay-demo", // Demo project ID for development
  chains: [mainnet, polygon, arbitrum, base, sepolia],
  ssr: true,
});
