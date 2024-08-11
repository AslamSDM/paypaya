
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import {abi} from "./Vault.json"

interface CreditReturn {
    "creditWorthiness": string,
    "creditScore": string
}

interface contractUserDetails{
    addr:string,
    newCredit:number,
    initial_credit_available:number,
    initial_credit_worthiness:number,
    world_id_verified_q:boolean
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
        const schemaUID = "0x6f307df2f1d1ae69a0134121fc5cb246ba3cdb182940efef71700ce55bcc8211";
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
                revocable: false, // Be aware that if your schema is not revocable, this MUST be false
                data: encodedData,
            },
        });
        const newAttestationUID = await tx.wait();
        console.log("New attestation UID:", newAttestationUID); return true
    } catch (e) { console.log("Attestation failed with following error ", e); return false }
}

export const createContractUser=async(props:contractUserDetails)=>{

    const vaultContract = new ethers.Contract("0xE63a7C8843116B4476c1979e4d072041c241A80A", abi, signer);
    const tx = await vaultContract.create_user(props.addr,ethers.parseEther(String(props.initial_credit_worthiness)),ethers.parseEther(String(props.initial_credit_available)),ethers.parseEther(String(props.world_id_verified_q)));
    const receipt = await tx.wait();
    return receipt
}

