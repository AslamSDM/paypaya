import express from 'express';
import bodyParser from 'body-parser';
import { ethers } from 'ethers';
import Dispatcherabi from '../contracts/artifacts/contracts/Dispatcher.sol/Dispatcher.json'
import USDCabi from '../contracts/artifacts/contracts/USDC.sol/USDC.json'
import { supabase } from './db/supabase';
import jwt from 'jsonwebtoken';
import { creditScoreCalculator } from './creditSystem';

const app = express();
const port = 3000;

const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
const signer = wallet.connect(provider);
const dispatcher = new ethers.Contract(process.env.DISPATCHER_CONTRACT ?? "", Dispatcherabi.abi, signer);
const USDC = new ethers.Contract(process.env.USDC_CONTRACT ?? "", USDCabi.abi, signer);
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/sms', async (req, res) => {
  console.log('Received SMS:', req.body);

  const { sender, content, msgId, rcvd } = req.body;
  const contentjson = JSON.parse(content);
  console.log('Received SMS:', contentjson);

  switch (contentjson.type) {
    case "send":
      const to = contentjson.to;
      const amount = ethers.parseUnits(contentjson.amount, 6)
      const fromaddress_data = await supabase.from('users').select('address').eq('phone', sender).single()
      const toaddress_data = await supabase.from('users').select('address').eq('phone', to).single()
      if (fromaddress_data.error || toaddress_data.error) {
        return res.send('User not found');
      }
      const approval = await USDC.allowance(fromaddress_data.data.address, process.env.DISPATCHER_CONTRACT ?? "");
      if (approval.lt(amount)) return res.send('Insufficient balance');
      const from = fromaddress_data.data.address;
      const toaddress = toaddress_data.data.address;
      const tx = dispatcher.send(from, toaddress, amount).then((tx) => {
        console.log('Transaction:', tx);
        return res.send('Transaction sent');
      });
      await supabase.from('transactions').insert([{ from: from, to: to, amount: amount.toString(), status: "pending" }])

      break;
    case "verify":
      if (!contentjson.token) {
        return res.send('Token not found');
      }
      // const token = jwt.verify(contentjson?.token, process.env.JWT_SECRET ?? "");
      const { error } = await supabase.from('users').update({ address: contentjson.token,isVerified:true }).eq('phone', sender);
      if (error) {
        return res.send('Error updating user');
      }
      return res.send('User updated successfully');
  }
});

app.get('/credit',async (req,res)=>{
  const {address,isWorldID_verified,isFarcaster_verified} = req.query;
  if(!address) return res.send('Address not found');

  const credit  = await creditScoreCalculator({
    addr: address as string,
    isWorldID_verified: isWorldID_verified === 'true',
    isFarcaster_verified: isFarcaster_verified === 'true'
  });
  return res.send(credit);

})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
