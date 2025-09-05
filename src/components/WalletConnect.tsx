"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { memo } from "react";

export const WalletConnect = memo(function WalletConnect() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-light text-black mb-2 tracking-tight">
          Connect Wallet
        </h2>
        <p className="text-gray-500 font-light">
          Choose from MetaMask, WalletConnect, or other supported wallets
        </p>
      </div>

      <div className="flex justify-center">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="bg-black text-white py-4 px-12 rounded-2xl hover:bg-gray-800 focus:outline-none font-medium text-lg transition-colors duration-200 flex items-center justify-center space-x-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <span>Connect Wallet</span>
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-red-500 text-white py-4 px-12 rounded-2xl hover:bg-red-600 focus:outline-none font-medium text-lg transition-colors duration-200 flex items-center justify-center space-x-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span>Wrong Network</span>
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-gray-100 text-black py-3 px-6 rounded-2xl hover:bg-gray-200 focus:outline-none font-medium text-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 20, height: 20 }}
                              />
                            )}
                          </div>
                        )}
                        <span>{chain.name}</span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-black text-white py-3 px-6 rounded-2xl hover:bg-gray-800 focus:outline-none font-medium text-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
});
