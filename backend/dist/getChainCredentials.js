"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODE_MAINNET_CREATION = exports.BASE_MAINNET_CREATION = exports.OPTIMISM_MAINNET_CREATION = exports.ETHEREUM_MAINNET_CREATION = exports.MODE_MAINNET_TRANSACTION = exports.BASE_MAINNET_TRANSACTION = exports.OPTIMISM_MAINNET_TRANSACTION = exports.ETHEREUM_MAINNET_TRANSACTION = void 0;
exports.ETHEREUM_MAINNET_TRANSACTION = "https://eth.blockscout.com/api/v2/addresses/${addr}/counters";
exports.OPTIMISM_MAINNET_TRANSACTION = "https://optimism.blockscout.com/api/v2/addresses/${addr}/counters";
exports.BASE_MAINNET_TRANSACTION = "https://base.blockscout.com/api/v2/addresses/${addr}/counters";
exports.MODE_MAINNET_TRANSACTION = "https://explorer.mode.network/api/v2/addresses/${addr}/counters";
// export const CELO_MAINNET_TRANSACTION= "https://explorer.celo.org/mainnet/api?module=account&action=txlist&address=${addr}"
exports.ETHEREUM_MAINNET_CREATION = "https://eth.blockscout.com/api/v2/addresses/${addr}";
exports.OPTIMISM_MAINNET_CREATION = "https://optimism.blockscout.com/api/v2/addresses/${addr}";
exports.BASE_MAINNET_CREATION = "https://base.blockscout.com/api/v2/addresses/${addr}";
exports.MODE_MAINNET_CREATION = "https://explorer.mode.network/api/v2/addresses/${addr}";
