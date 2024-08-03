// get transaction counts for all the chains in 

import {getTransactionCount,getWalletReputation,getPOAP,getUniswap} from "./creditSystem_helpers"

const chains=["eth","optimism","base","mode"]
const creditScoreCalculator=async(addr:string)=>{

    let creditParams={
        number_of_transaction_on_ethereum_chain:0, 
        number_of_transaction_on_optimism_chain:0, 
        number_of_transaction_on_mode_chain:0, 
        number_of_transaction_on_base_chain:0,
        reputation_score_on_ethereum_chain:0,
        reputation_score_on_optimism_chain:0,
        reputation_score_on_mode_chain:0,
        reputation_score_on_base_chain:0,
        number_of_interactions_with_uniswap:0,
        number_of_poap_nft:0
    }
    // get teh total assets holding on superchains
    const transactionCounts= await Promise.all(
        chains.map(chain => getTransactionCount(addr, chain))
    );

    const reputationScores = await Promise.all(chains.map(chain =>getWalletReputation(addr,chain)))

// get the interactions with reputed protocols like uniswap, aave and poap using goldsky etc etc

creditParams.number_of_interactions_with_uniswap = await getUniswap(addr);
creditParams.number_of_poap_nft = await getPOAP(addr);
creditParams.number_of_transaction_on_base_chain = transactionCounts[2].transactionCount
creditParams.number_of_transaction_on_ethereum_chain = transactionCounts[0].transactionCount
creditParams.number_of_transaction_on_optimism_chain = transactionCounts[1].transactionCount
creditParams.number_of_transaction_on_mode_chain = transactionCounts[3].transactionCount
creditParams.reputation_score_on_base_chain=reputationScores[2]
creditParams.reputation_score_on_ethereum_chain=reputationScores[0]
creditParams.reputation_score_on_optimism_chain=reputationScores[1]
creditParams.reputation_score_on_mode_chain=reputationScores[3]
// ask an ai model to give a credit worthiness
console.log({creditParams})
//Make an attestation based on the ai response (optional to do here)

// return creditWorthiness & credit score

}

creditScoreCalculator("0x94C0e474f0532a5271f00aFe16B59D1031FeBfae")