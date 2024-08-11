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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const ethers_1 = require("ethers");
const Dispatcher_json_1 = __importDefault(require("../contracts/artifacts/contracts/Dispatcher.sol/Dispatcher.json"));
const USDC_json_1 = __importDefault(require("../contracts/artifacts/contracts/USDC.sol/USDC.json"));
const supabase_1 = require("./db/supabase");
const creditSystem_1 = require("./creditSystem");
const app = (0, express_1.default)();
const port = 3000;
const provider = new ethers_1.ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
const wallet = new ethers_1.ethers.Wallet((_a = process.env.PRIVATE_KEY) !== null && _a !== void 0 ? _a : "", provider);
const signer = wallet.connect(provider);
const dispatcher = new ethers_1.ethers.Contract((_b = process.env.DISPATCHER_CONTRACT) !== null && _b !== void 0 ? _b : "", Dispatcher_json_1.default.abi, signer);
const USDC = new ethers_1.ethers.Contract((_c = process.env.USDC_CONTRACT) !== null && _c !== void 0 ? _c : "", USDC_json_1.default, signer);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/sms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Received SMS:', req.body);
    const { sender, content, msgId, rcvd } = req.body;
    const contentjson = JSON.parse(content);
    console.log('Received SMS:', contentjson);
    switch (contentjson.type) {
        case "send":
            const to = contentjson.to;
            const amount = ethers_1.ethers.parseUnits(contentjson.amount, 6);
            const fromaddress_data = yield supabase_1.supabase.from('users').select('address').eq('phone', sender).single();
            const toaddress_data = yield supabase_1.supabase.from('users').select('address').eq('phone', to).single();
            if (fromaddress_data.error || toaddress_data.error) {
                return res.send('User not found');
            }
            const approval = yield USDC.allowance(fromaddress_data.data.address, (_a = process.env.DISPATCHER_CONTRACT) !== null && _a !== void 0 ? _a : "");
            if (approval.lt(amount))
                return res.send('Insufficient balance');
            const from = fromaddress_data.data.address;
            const toaddress = toaddress_data.data.address;
            const tx = dispatcher.send(from, toaddress, amount).then((tx) => {
                console.log('Transaction:', tx);
                return res.send('Transaction sent');
            });
            yield supabase_1.supabase.from('transactions').insert([{ from: from, to: to, amount: amount.toString(), status: "pending" }]);
            break;
        case "verify":
            if (!contentjson.token) {
                return res.send('Token not found');
            }
            // const token = jwt.verify(contentjson?.token, process.env.JWT_SECRET ?? "");
            const { error } = yield supabase_1.supabase.from('users').update({ address: contentjson.token, isVerified: true }).eq('phone', sender);
            if (error) {
                return res.send('Error updating user');
            }
            return res.send('User updated successfully');
    }
}));
app.get('/credit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, isWorldID_verified, isFarcaster_verified } = req.query;
    if (!address)
        return res.send('Address not found');
    const credit = yield (0, creditSystem_1.creditScoreCalculator)({
        addr: address,
        isWorldID_verified: isWorldID_verified === 'true',
        isFarcaster_verified: isFarcaster_verified === 'true'
    });
    return res.send(credit);
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
