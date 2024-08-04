
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";


interface CreditReturn {
    "creditWorthiness": string,
    "creditScore": string
}



const privateKey = "0xae1c82de859407ab3d6f276ae4424b6230b1c2bef607a1e9d836619da064fea4";
const url ="https://sepolia.base.org"
const provider = new ethers.JsonRpcProvider(url);
const signer = new ethers.Wallet(privateKey, provider);
console.log({provider})
console.log({signer})
export const setAttestation = async (addr: string, credit_parameters: CreditReturn): Promise<boolean> => {
    try {
        console.log(  await provider.getBalance(signer.address))
        const credit_worthiness = Number((credit_parameters.creditWorthiness).slice(1))
        const credit_score = Number((credit_parameters.creditScore))
        console.log({credit_worthiness})
        console.log({credit_score})
        const easContractAddress = "0x4200000000000000000000000000000000000021";
        const schemaUID = "0x4b2f0e6f8056a48e3f028c538d2d2ed88f0846ec147c3497c8af29f6c494fdef";
        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.
        // const signer = provider.getSigner()
        //@ts-ignore
        await eas.connect(signer);
        // Initialize SchemaEncoder with the schema string
        const schemaEncoder = new SchemaEncoder("uint256 creditWorthiness,uint8 creditScore,address user");
        const encodedData = schemaEncoder.encodeData([
            { name: "creditWorthiness", value: BigInt(credit_worthiness * 10 ** 18), type: "uint256" },
            { name: "creditScore", value: credit_score, type: "uint8" },
            { name: "user", value: addr, type: "address" }
        ]);
        const tx = await eas.attest({
            schema: schemaUID,
            data: {
                recipient: addr,
                //@ts-ignore
                expirationTime: 0,
                revocable: true, // Be aware that if your schema is not revocable, this MUST be false
                data: encodedData,
            },
        });
        const newAttestationUID = await tx.wait();
        console.log("New attestation UID:", newAttestationUID); return true
    } catch (e) { console.log("Attestation failed with following error ", e); return false }
}