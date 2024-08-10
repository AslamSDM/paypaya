export const networks: INetwork[] = [
    {
        chainId: 11155111,
        name: "ETHSepolia",
        url: "https://eth-sepolia.g.alchemy.com/v2/zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo",
    },
    {
        chainId: 919,
        name: "Mode testnet",
        url: "https://sepolia.mode.network",
    },
    {   chainId: 84532,
        name: "baseSepolia",
        url: "https://sepolia.base.org",
    },
    {
        chainId: 11155420,
        name: "optimismSepolia",
        url: "https://opt-sepolia.g.alchemy.com/v2/zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo",
    },
    {
        chainId: 252,
        name: "fraxtal",
        url: "https://rpc.frax.com",
    },
    {
        chainId: 1740,
        name: "metal l2 testnet",
        url: "https://testnet.rpc.metall2.com/"
    }
   
]

export interface INetwork {
    chainId: Number;
    name: string;
    url: string;
}