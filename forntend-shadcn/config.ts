import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { baseSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "linear",
  auth: {
    sections: [[{"type":"email"}],[{"type":"passkey"}]],
    addPasskeyOnSignup: true,
  },
};

export const config = createConfig({
  // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
  // get this from the app config you create at https://dashboard.alchemy.com/accounts
  apiKey: "QHSXhdvHnPMLbRHNHFU7Z0Lsn9nGDyDG",
  chain: baseSepolia,
  ssr: true, // set to false if you're not using server-side rendering
}, uiConfig);

export const queryClient = new QueryClient();