
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";


interface CreditReturn {
    "creditWorthiness": string,
    "creditScore": string
}


const privateKey = "0x212d9555aa109843a11e7c2239f30c863b4cd1af4756c1ed1fc270b3df82b127";
const provider = new ethers.providers.JsonRpcProvider("https://base-sepolia.g.alchemy.com/v2/MsUbDohCL-tzG7e-xWXf9q-iWVp627sZ")
const signer = new ethers.Wallet(privateKey, provider);

export const setAttestation = async (addr: string, credit_parameters: CreditReturn): Promise<boolean> => {
    try {
        const credit_worthiness = Number((credit_parameters.creditWorthiness).slice(1))
        const credit_score = Number((credit_parameters.creditWorthiness))
        const easContractAddress = "0x4200000000000000000000000000000000000021";
        const schemaUID = "0x4b2f0e6f8056a48e3f028c538d2d2ed88f0846ec147c3497c8af29f6c494fdef";
        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.
        const signer = provider.getSigner()
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
                recipient: "0xdF79A13d5d6CCcA1D1a0e67Ecf1d1fB17658e80A",
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