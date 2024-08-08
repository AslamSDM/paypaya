const express = require('express');
//const { createClient } = require('@supabase/supabase-js');
const { ethers } = require("ethers");

const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const provider = new ethers.JsonRpcProvider('https://sepolia.base.org/');
const usdcAddress = '0x49b26d8D6Fef9A3Ed91E663E01Aa91D16fE6ddC5';
const accountAddress = '0xdF79A13d5d6CCcA1D1a0e67Ecf1d1fB17658e80A';

const abi = require('./abi.js');

async function getUSDCInfo() {
  // Create contract instance with the extended ABI
  const contract = new ethers.Contract(usdcAddress, abi, provider);
  try {
    // Call multiple functions using the extended ABI
    const balance = await contract.balanceOf(accountAddress);
    // Format the balance
    const formattedBalance = ethers.formatUnits(balance, 18);  
    console.log(`Balance: ${formattedBalance}`);
    return formattedBalance;
  } catch (error) {
    console.error('Error:', error);
  }

}

let prev_value=0

async function pooling() {
  while(true){
  const data= await getUSDCInfo();
  if (Number(prev_value)== 0||Number(prev_value)==Number(data)){
    console.log(Number(prev_value))
    console.log(Number(data))
      }
  else{
    if(Number(prev_value)>Number(data)){
        console.log("enter")
        fetchAndSend(30);   //10dollars sent
      }
    else{
      console.log("enter_1")
      fetchAndSend(10);   //10dollars recieved
    }
  }
    prev_value =data
    await delay(5000);
}
}

// pooling();
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


pooling();



async function fetchAndSend(condition) {
  try {

    const hex_list_1=[condition]
    console.log(hex_list_1)
    // Send to NodeMCU
    await sendToNodeMCU(hex_list_1);

    console.log(`Fetched and Sent to NodeMCU: ${condition}`);
  } catch (error) {
    console.error(`Error fetching and sending: ${condition}:`, error);
  }
}

async function sendToNodeMCU(hexList) {
  const nodeMCUUrl = 'http://192.168.29.87/receive_list';
  try {
    await axios.post(nodeMCUUrl, { hexList });
    console.log('List sent successfully to NodeMCU');
  } catch (error) {
    console.error('Failed to send list to NodeMCU:', error);
  }
}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});