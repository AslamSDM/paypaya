import {
    ETHEREUM_MAINNET_TRANSACTION,
    OPTIMISM_MAINNET_TRANSACTION,
    MODE_MAINNET_TRANSACTION,
    BASE_MAINNET_TRANSACTION,
    ETHEREUM_MAINNET_CREATION,
    OPTIMISM_MAINNET_CREATION,
    BASE_MAINNET_CREATION,
    MODE_MAINNET_CREATION
} from "./getChainCredentials";
import openAI, { OpenAI } from "openai"
import { SYSTEM_PROMPT } from "./utils/promts";
const GOLDSKY_SUBGRAPH_URL = "https://api.goldsky.com/api/public/project_clzekg9bg0txc01x8d5seagkd/subgraphs/poap-subgraph/1.0.0/gn"
interface WalletInfo {
    block_number_balance_updated_at: number;
    coin_balance: string;
    creation_tx_hash: string | null;
    ens_domain_name: string | null;
    exchange_rate: string;
    has_beacon_chain_withdrawals: boolean;
    has_token_transfers: boolean;
    has_tokens: boolean;
    hash: string;
    is_contract: boolean;
}
interface BlockscoutResponse {
    transactions_count: string;
    token_transfers_count: string;
    gas_usage_count: string;
    validations_count: string;
}

interface TransactionCounts {
    transactionCount: number;
    tokenTransferCount: number;
}

interface Token {
    id: string;
    owner: {
        id: string;
        tokensOwned: string;
    };
}

interface AccountData {
    account: {
        tokens: Token[];
    };
}

interface QueryResponse {
    data: AccountData;
}

interface UniswapData {
    "data": {
        "swaps": []
    }
}


interface CreditParams {

    number_of_transaction_on_ethereum_chain: number,
    number_of_transaction_on_optimism_chain: number,
    number_of_transaction_on_mode_chain: number,
    number_of_transaction_on_base_chain: number,
    reputation_score_on_ethereum_chain: number,
    reputation_score_on_optimism_chain: number,
    reputation_score_on_mode_chain: number,
    reputation_score_on_base_chain: number,
    number_of_interactions_with_uniswap: number,
    number_of_poap_nft: number
}

interface CreditReturn {
    "creditWorthiness": string,
    "creditScore": string
}
const getChainLinkForTransactions = (chain: string) => {
    switch (chain) {
        case 'eth':
            return ETHEREUM_MAINNET_TRANSACTION;
        case 'optimism':
            return OPTIMISM_MAINNET_TRANSACTION;
        case 'mode':
            return MODE_MAINNET_TRANSACTION;
        case 'base':
            return BASE_MAINNET_TRANSACTION;
        default:
            return BASE_MAINNET_TRANSACTION;
    }
}

const getChainLinkForCreation = (chain: string) => {
    switch (chain) {
        case 'eth':
            return ETHEREUM_MAINNET_CREATION;
        case 'optimism':
            return OPTIMISM_MAINNET_CREATION;
        case 'mode':
            return MODE_MAINNET_CREATION;
        case 'base':
            return BASE_MAINNET_CREATION;
        default:
            return BASE_MAINNET_CREATION;
    }

}


export async function getPOAP(addr: string): Promise<number> {
    try {
        const query = ` query MyQuery {
        account(id: "${addr}") {
          tokens(first: 1000) {
            id
            owner {
              id
              tokensOwned
            }
            event {
              tokenCount
            }
          }
        }
      }`

        const response = await fetch(GOLDSKY_SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json() as QueryResponse;
        if (result.data.account == null) return 0
        return result.data.account.tokens.length
    } catch (e) {
        console.log(e)
        return 0
    }


}

export async function getUniswap(addr: string): Promise<number> {
    try {
        const query = `query MyQuery {
  swaps(first: 100, where: {sender: "${addr}"}) {
    id
  }
}`
        const url_base = `https://gateway-arbitrum.network.thegraph.com/api/b26b587206a49efaa156b16fb6f76cda/subgraphs/id/HMuAwufqZ1YCRmzL2SfHTVkzZovC9VL2UAKhjvRqKiR1`
        const url_mainnet = `https://gateway-arbitrum.network.thegraph.com/api/b26b587206a49efaa156b16fb6f76cda/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B`
        const response_base = await fetch(url_base, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        if (!response_base.ok) {
            throw new Error(`HTTP error! status: ${response_base.status}`);
        }

        const response_mainnet = await fetch(url_mainnet, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        if (!response_mainnet.ok) {
            throw new Error(`HTTP error! status: ${response_mainnet.status}`);
        }
        const result_mainnet = await response_mainnet.json() as UniswapData;
        const result_base = await response_base.json() as UniswapData;
        console.log({ result_mainnet })
        console.log({ result_base })
        return (result_mainnet.data.swaps.length + result_base.data.swaps.length)
    } catch (e) { console.log(e); return 0 }
}

async function getWalletInfo(addr: string, chain: string): Promise<WalletInfo> {
    const url = (getChainLinkForCreation(chain)).replace("${addr}", addr);

    try {
        const response = await fetch(url);
        const data = await response.json() as WalletInfo;
        return data;
    } catch (error) {
        console.error(`Error fetching wallet info for ${chain}:`, error);
        throw error;
    }
}

function calculateWalletReputation(walletInfo: WalletInfo): number {
    let reputationScore = 0;

    // 1. Balance score (0-30 points)
    const balanceInEth = parseFloat(walletInfo.coin_balance) / 1e18;
    const balanceScore = Math.min(balanceInEth * 10, 30);
    reputationScore += balanceScore;

    // 2. Account age score (0-20 points)
    // Assuming the current block is roughly 21,000,000 for Ethereum mainnet
    const approximateBlocksPerYear = 2102400; // ~15 seconds per block
    const accountAgeInYears = (21000000 - walletInfo.block_number_balance_updated_at) / approximateBlocksPerYear;
    const ageScore = Math.min(accountAgeInYears * 4, 20);
    reputationScore += ageScore;

    // 3. ENS domain bonus (5 points)
    if (walletInfo.ens_domain_name) {
        reputationScore += 5;
    }

    // 4. Activity score (0-25 points)
    if (walletInfo.has_token_transfers) reputationScore += 10;
    if (walletInfo.has_tokens) reputationScore += 15;

    // 5. Beacon chain participation bonus (10 points)
    if (walletInfo.has_beacon_chain_withdrawals) {
        reputationScore += 10;
    }

    // 6. Non-contract bonus (10 points)
    if (!walletInfo.is_contract) {
        reputationScore += 10;
    }

    return Math.min(reputationScore, 100); // Cap at 100
}

export async function getWalletReputation(addr: string, chain: string): Promise<number> {
    try {
        const walletInfo = await getWalletInfo(addr, chain);
        const reputationScore = calculateWalletReputation(walletInfo);
        console.log(`Wallet Reputation Score for ${addr} on ${chain}: ${reputationScore.toFixed(2)}`);
        return reputationScore;
    } catch (error) {
        console.error(`Error calculating wallet reputation for ${addr} on ${chain}:`, error);
        return 0;
    }
}

export async function getAICreditScore(credit_params: CreditParams): Promise<CreditReturn | undefined> {
    const openAI = new OpenAI({ apiKey: "" }) // change to our own
    const stream = await openAI.chat.completions.create(
        {
            model: 'gpt-4o-mini',
            messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: JSON.stringify(credit_params) }],
            stream: false
        }
    )
    if (stream.choices[0].message.content != null)
        return JSON.parse(stream.choices[0].message.content) as CreditReturn
}


export const getTransactionCount = async (addr: string, chain: string): Promise<TransactionCounts> => {
    const url = (getChainLinkForTransactions(chain)).replace("${addr}", addr)
    try {
        const response = await fetch(url);
        const data = await response.json() as BlockscoutResponse;

        if (data && 'transactions_count' in data && 'token_transfers_count' in data) {
            const transactionCount = parseInt(data.transactions_count, 10);
            const tokenTransferCount = parseInt(data.token_transfers_count, 10);

            console.log(`Chain: ${chain}, Transactions: ${transactionCount}, Token Transfers: ${tokenTransferCount}`);

            return {
                transactionCount: isNaN(transactionCount) ? 0 : transactionCount,
                tokenTransferCount: isNaN(tokenTransferCount) ? 0 : tokenTransferCount
            };
        } else {
            console.error('Invalid response structure: required fields not found');
            return { transactionCount: 0, tokenTransferCount: 0 };
        }
    } catch (error) {
        console.error(`Error fetching transaction count for ${chain}:`, error);
        return { transactionCount: 0, tokenTransferCount: 0 };
    }
}
