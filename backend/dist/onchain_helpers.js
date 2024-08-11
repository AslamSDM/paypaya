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
exports.createContractUser = exports.setAttestation = void 0;
const eas_sdk_1 = require("@ethereum-attestation-service/eas-sdk");
const ethers_1 = require("ethers");
const Vault_json_1 = require("./Vault.json");
const privateKey = "0xae1c82de859407ab3d6f276ae4424b6230b1c2bef607a1e9d836619da064fea4";
const url = "https://sepolia.base.org";
const provider = new ethers_1.ethers.JsonRpcProvider(url);
const signer = new ethers_1.ethers.Wallet(privateKey, provider);
console.log({ provider });
console.log({ signer });
const setAttestation = (addr, credit_parameters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(yield provider.getBalance(signer.address));
        const credit_worthiness = Number((credit_parameters.creditWorthiness).slice(1));
        const credit_score = Number((credit_parameters.creditScore));
        console.log({ credit_worthiness });
        console.log({ credit_score });
        const easContractAddress = "0x4200000000000000000000000000000000000021";
        const schemaUID = "0x6f307df2f1d1ae69a0134121fc5cb246ba3cdb182940efef71700ce55bcc8211";
        const eas = new eas_sdk_1.EAS(easContractAddress);
        // Signer must be an ethers-like signer.
        // const signer = provider.getSigner()
        //@ts-ignore
        yield eas.connect(signer);
        // Initialize SchemaEncoder with the schema string
        const schemaEncoder = new eas_sdk_1.SchemaEncoder("uint256 creditWorthiness,uint8 creditScore,address user");
        const encodedData = schemaEncoder.encodeData([
            { name: "creditWorthiness", value: BigInt(credit_worthiness * Math.pow(10, 18)), type: "uint256" },
            { name: "creditScore", value: credit_score, type: "uint8" },
            { name: "user", value: addr, type: "address" }
        ]);
        const tx = yield eas.attest({
            schema: schemaUID,
            data: {
                recipient: addr,
                //@ts-ignore
                expirationTime: 0,
                revocable: false, // Be aware that if your schema is not revocable, this MUST be false
                data: encodedData,
            },
        });
        const newAttestationUID = yield tx.wait();
        console.log("New attestation UID:", newAttestationUID);
        return true;
    }
    catch (e) {
        console.log("Attestation failed with following error ", e);
        return false;
    }
});
exports.setAttestation = setAttestation;
const createContractUser = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const vaultContract = new ethers_1.ethers.Contract("0xE63a7C8843116B4476c1979e4d072041c241A80A", Vault_json_1.abi, signer);
    const tx = yield vaultContract.create_user(props.addr, ethers_1.ethers.parseEther(String(props.initial_credit_worthiness)), ethers_1.ethers.parseEther(String(props.initial_credit_available)), ethers_1.ethers.parseEther(String(props.world_id_verified_q)));
    const receipt = yield tx.wait();
    return receipt;
});
exports.createContractUser = createContractUser;
