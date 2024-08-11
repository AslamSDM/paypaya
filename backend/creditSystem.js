"use strict";
// get transaction counts for all the chains in 
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
exports.creditScoreCalculator = void 0;
const creditSystem_helpers_1 = require("./creditSystem_helpers");
const chains = ["eth", "optimism", "base", "mode"];
const creditScoreCalculator = (props) => __awaiter(void 0, void 0, void 0, function* () {
    let creditParams = {
        number_of_transaction_on_ethereum_chain: 0,
        number_of_transaction_on_optimism_chain: 0,
        number_of_transaction_on_mode_chain: 0,
        number_of_transaction_on_base_chain: 0,
        reputation_score_on_ethereum_chain: 0,
        reputation_score_on_optimism_chain: 0,
        reputation_score_on_mode_chain: 0,
        reputation_score_on_base_chain: 0,
        number_of_interactions_with_uniswap: 0,
        number_of_poap_nft: 0,
        isWorldID_verified: props.isWorldID_verified,
        isFarcaster_verified: props.isFarcaster_verified
    };
    // get teh total assets holding on superchains
    const transactionCounts = yield Promise.all(chains.map(chain => (0, creditSystem_helpers_1.getTransactionCount)(props.addr, chain)));
    const reputationScores = yield Promise.all(chains.map(chain => (0, creditSystem_helpers_1.getWalletReputation)(props.addr, chain)));
    // get the interactions with reputed protocols like uniswap, aave and poap using goldsky etc etc
    creditParams.number_of_interactions_with_uniswap = yield (0, creditSystem_helpers_1.getUniswap)(props.addr);
    creditParams.number_of_poap_nft = yield (0, creditSystem_helpers_1.getPOAP)(props.addr);
    creditParams.number_of_transaction_on_base_chain = transactionCounts[2].transactionCount;
    creditParams.number_of_transaction_on_ethereum_chain = transactionCounts[0].transactionCount;
    creditParams.number_of_transaction_on_optimism_chain = transactionCounts[1].transactionCount;
    creditParams.number_of_transaction_on_mode_chain = transactionCounts[3].transactionCount;
    creditParams.reputation_score_on_base_chain = reputationScores[2];
    creditParams.reputation_score_on_ethereum_chain = reputationScores[0];
    creditParams.reputation_score_on_optimism_chain = reputationScores[1];
    creditParams.reputation_score_on_mode_chain = reputationScores[3];
    // ask an ai model to give a credit worthiness
    console.log({ creditParams });
    //Make an attestation based on the ai response (optional to do here)
    const credit = yield (0, creditSystem_helpers_1.getAICreditScore)(creditParams);
    if (credit) {
        // setAttestation(addr,credit)
        return credit;
    }
    else
        return "Error fetching creditScore";
    // return creditWorthiness & credit score
});
exports.creditScoreCalculator = creditScoreCalculator;
// creditScoreCalculator("0x94C0e474f0532a5271f00aFe16B59D1031FeBfae")
