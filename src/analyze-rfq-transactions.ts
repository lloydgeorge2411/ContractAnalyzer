import yargs, { Arguments } from "yargs";
import { hideBin } from "yargs/helpers";
import { EtherscanAPI } from "./api/etherscan.api";
import { EtherscanService } from "./services/etherscan.service";
import fs from "fs";
import { EtherscanEvent } from "./types/etherscan.type";
import { EthersConstants, TOKENS } from "./constants/ethers.constants";
import { ethers } from "ethers";

/**
 * Main script that calculates profit and transaction counts for a specific Ethereum 
 * address by analyzing internal transactions and associated logs.
 * 
 * This script leverages the Etherscan API to retrieve the latest block number and 
 * processes transaction logs within a specified block range. It calculates and 
 * logs profits in USD based on transaction input amounts and predefined constants.
 */
const main = async () => {
  // Parsing command line arguments with yargs to obtain the start block number
  const argv = (await yargs(hideBin(process.argv))
    .option("start", {
      alias: "s",
      description: "Start Block Number", // Description of the start block parameter
      type: "number",
      demandOption: true, // This option is required
    })
    .help()
    .alias("h", "help").argv) as Arguments;
  
  // Extract and typecast start block from command line arguments
  const startBlock = argv.start as number;
  // Retrieve the latest block from Etherscan API
  const endBlock = await EtherscanAPI.getLatestBlock();

  // Read and parse Clipper logs from a JSON file
  const logs: EtherscanEvent[] = JSON.parse(fs.readFileSync("./data/clipper-logs.json", "utf-8"));

  // Fetch internal transactions for a specific Ethereum address within the specified block range
  const internalTxs = await EtherscanService.getInternalTransactionsByAddress("0xa487e3c1d7880675f5578e24110ba138c2558c1e", startBlock, endBlock);
  
  const profitResult: Record<number, number> = {}; // Initialize a record to store profits by input amount
  const countResult: Record<number, number> = {}; // Initialize a record to store transaction counts by input amount
  let maxInput = 0; // Variable to track the maximum input

  // Iterate over each internal transaction and correlate with logs to calculate profit and input in USD
  for (let i = 0; i < internalTxs.length; i++) {
    // Find a corresponding log entry for the current transaction
    const log = logs.find((l) => l.transactionHash.toLowerCase() === internalTxs[i].hash.toLowerCase());
    
    if (log) {
      const inputToken = "0x" + log.topics[1].slice(-40).toLowerCase(); // Extract the input token address from logs
      const inputPrice = inputToken === TOKENS.WETH ? EthersConstants.ETH_PRICE : 1; // Determine input token price in USD
      const inputAmount = BigInt(log.data.slice(0, 66)); // Extract input amount from logs
      const inputUSD = Math.floor(Number(ethers.formatUnits(inputAmount, EthersConstants.TokenDecimals[inputToken as TOKENS])) * inputPrice); // Calculate input amount in USD
      const profit = Number(ethers.formatEther(BigInt(internalTxs[i].value))) * 3000; // Calculate profit in USD assuming $3000/ETH

      if (maxInput < inputUSD) {
        maxInput = inputUSD; // Update max input if the current input is greater
      }

      // Accumulate profit and transaction count for the current input USD
      if (profitResult[inputUSD]) {
        profitResult[inputUSD] += profit;
      } else {
        profitResult[inputUSD] = profit;
      }

      if (countResult[inputUSD]) {
        countResult[inputUSD]++;
      } else {
        countResult[inputUSD] = 1;
      }
    }
  }

  // Log the results to the console
  console.log(`Max Input: ${maxInput}`);
  console.log(`Profit Result: ${JSON.stringify(profitResult)}`);
  console.log(`Count Result: ${JSON.stringify(countResult)}`);
};

// Execute the main function
main();