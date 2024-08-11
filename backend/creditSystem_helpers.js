"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionCount = void 0;
exports.getPOAP = getPOAP;
exports.getUniswap = getUniswap;
exports.getWalletReputation = getWalletReputation;
exports.getAICreditScore = getAICreditScore;
const getChainCredentials_1 = require("./getChainCredentials");
const openai_1 = require("openai");
const promts_1 = require("./utils/promts");
const GOLDSKY_SUBGRAPH_URL_POAP = "https://api.goldsky.com/api/public/project_clzekg9bg0txc01x8d5seagkd/subgraphs/poap-subgraph/1.0.0/gn";
const GOLDSKY_SUBGRAPH_URL_UNISWAP = "https://api.goldsky.com/api/public/project_clzekg9bg0txc01x8d5seagkd/subgraphs/uniswapCredibility/1.0.0/gn";
const GOLDSKY_SUBGRAPH_URL_AAVE = "https://api.goldsky.com/api/public/project_clzekg9bg0txc01x8d5seagkd/subgraphs/aaveCredibility/1.0.0/gn";
const GOLDSKY_SUBGRAPH_URL_SUSHI = "https://api.goldsky.com/api/public/project_clzekg9bg0txc01x8d5seagkd/subgraphs/sushiCredibility/1.0.0/gn";
const GOLDSKY_SUBGRAPH_URL_ONEINCH = "https://api.goldsky.com/api/public/project_clzekg9bg0txc01x8d5seagkd/subgraphs/oneinchCredibility/1.0.0/gn";
const getChainLinkForTransactions = (chain) => {
    switch (chain) {
        case 'eth':
            return getChainCredentials_1.ETHEREUM_MAINNET_TRANSACTION;
        case 'optimism':
            return getChainCredentials_1.OPTIMISM_MAINNET_TRANSACTION;
        case 'mode':
            return getChainCredentials_1.MODE_MAINNET_TRANSACTION;
        case 'base':
            return getChainCredentials_1.BASE_MAINNET_TRANSACTION;
        default:
            return getChainCredentials_1.BASE_MAINNET_TRANSACTION;
    }
};
const getChainLinkForCreation = (chain) => {
    switch (chain) {
        case 'eth':
            return getChainCredentials_1.ETHEREUM_MAINNET_CREATION;
        case 'optimism':
            return getChainCredentials_1.OPTIMISM_MAINNET_CREATION;
        case 'mode':
            return getChainCredentials_1.MODE_MAINNET_CREATION;
        case 'base':
            return getChainCredentials_1.BASE_MAINNET_CREATION;
        default:
            return getChainCredentials_1.BASE_MAINNET_CREATION;
    }
};
function getPOAP(addr) {
    return __awaiter(this, void 0, void 0, function* () {
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
      }`;
            const response = yield fetch(GOLDSKY_SUBGRAPH_URL_POAP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = yield response.json();
            if (result.data.account == null)
                return 0;
            return result.data.account.tokens.length;
        }
        catch (e) {
            console.log(e);
            return 0;
        }
    });
}
function getUniswap(addr) {
    return __awaiter(this, void 0, void 0, function* () {
        const queries = {
            uniswap: `query { swaps(first: 100, where: {sender: "${addr}"}) { id } }`,
            aave: `query { userTransactions(first: 100, where: {user: "${addr}"}) { user } }`,
            sushi: `query { swaps(first: 100, where: {sender: "${addr}"}) { id } }`, // Same as Uniswap
            oneinch: `query { swapeds(where: {sender: "${addr}"}) { sender } }`
        };
        const endpoints = [
            { url: GOLDSKY_SUBGRAPH_URL_UNISWAP, query: queries.uniswap },
            { url: GOLDSKY_SUBGRAPH_URL_AAVE, query: queries.aave },
            { url: GOLDSKY_SUBGRAPH_URL_SUSHI, query: queries.sushi },
            { url: GOLDSKY_SUBGRAPH_URL_ONEINCH, query: queries.oneinch }
        ];
        const fetchPromises = endpoints.map(({ url, query }) => fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(response => {
            console.log(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).catch(e => {
            console.error(e);
            return { data: { swaps: [], userTransactions: [], swapeds: [] } }; // Return empty data on error
        }));
        try {
            const results = yield Promise.all(fetchPromises);
            return results.reduce((total, result, index) => {
                if (index === 0)
                    return total + results[0].data.swaps.length; // Uniswap
                if (index === 1)
                    return total + results[1].data.userTransactions.length; // Aave
                if (index === 2)
                    return total + results[2].data.swaps.length; // Sushi
                if (index === 3)
                    return total + results[3].data.swapeds.length; // OneInch
                return total;
            }, 0);
        }
        catch (e) {
            console.error(e);
            return 0;
        }
    });
}
function getWalletInfo(addr, chain) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = (getChainLinkForCreation(chain)).replace("${addr}", addr);
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(`Error fetching wallet info for ${chain}:`, error);
            throw error;
        }
    });
}
function calculateWalletReputation(walletInfo) {
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
    if (walletInfo.has_token_transfers)
        reputationScore += 10;
    if (walletInfo.has_tokens)
        reputationScore += 15;
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
function getWalletReputation(addr, chain) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const walletInfo = yield getWalletInfo(addr, chain);
            const reputationScore = calculateWalletReputation(walletInfo);
            console.log(`Wallet Reputation Score for ${addr} on ${chain}: ${reputationScore.toFixed(2)}`);
            return reputationScore;
        }
        catch (error) {
            console.error(`Error calculating wallet reputation for ${addr} on ${chain}:`, error);
            return 0;
        }
    });
}
function getAICreditScore(credit_params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const openAI = new openai_1.OpenAI({ apiKey: (_a = process.env.OPENAI_KEY) !== null && _a !== void 0 ? _a : "" }); // change to our own
        const stream = yield openAI.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: "system", content: promts_1.SYSTEM_PROMPT }, { role: "user", content: JSON.stringify(credit_params) }],
            stream: false
        });
        if (stream.choices[0].message.content != null)
            return JSON.parse(stream.choices[0].message.content);
    });
}
const getTransactionCount = (addr, chain) => __awaiter(void 0, void 0, void 0, function* () {
    const url = (getChainLinkForTransactions(chain)).replace("${addr}", addr);
    try {
        const response = yield fetch(url);
        const data = yield response.json();
        if (data && 'transactions_count' in data && 'token_transfers_count' in data) {
            const transactionCount = parseInt(data.transactions_count, 10);
            const tokenTransferCount = parseInt(data.token_transfers_count, 10);
            console.log(`Chain: ${chain}, Transactions: ${transactionCount}, Token Transfers: ${tokenTransferCount}`);
            return {
                transactionCount: isNaN(transactionCount) ? 0 : transactionCount,
                tokenTransferCount: isNaN(tokenTransferCount) ? 0 : tokenTransferCount
            };
        }
        else {
            console.error('Invalid response structure: required fields not found');
            return { transactionCount: 0, tokenTransferCount: 0 };
        }
    }
    catch (error) {
        console.error(`Error fetching transaction count for ${chain}:`, error);
        return { transactionCount: 0, tokenTransferCount: 0 };
    }
});
exports.getTransactionCount = getTransactionCount;
