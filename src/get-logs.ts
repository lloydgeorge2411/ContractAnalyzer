import yargs, { Arguments } from "yargs";
import { hideBin } from "yargs/helpers";
import { EtherscanService } from "./services/etherscan.service";
import { EtherscanAPI } from "./api/etherscan.api";
import fs from "fs";

/**
 * Main function that orchestrates the process of fetching logs
 * from the Ethereum blockchain using Etherscan APIs.
 * 
 * Utilizes yargs to parse command line arguments enabling the user
 * to provide specific parameters like address, topic, and starting block.
 */
const main = async () => {
  // Parsing command line arguments with yargs
  const argv = (await yargs(hideBin(process.argv))
    .option("address", {
      alias: "a",
      description: "address to get logs",
      type: "string",
      demandOption: true // Ensuring that the address parameter is provided
    })
    .option("topic", {
      alias: "t",
      description: "topic to filter logs",
      type: "string",
      demandOption: true // Ensuring that the topic parameter is provided
    })
    .option("start", {
      alias: "s",
      description: "Start Block Number",
      type: "number",
      demandOption: true // Ensuring that the start block parameter is provided
    })
    .help() // Adding a help option
    .alias("h", "help") // Providing alias for better CLI experience
    .argv
  ) as Arguments;

  // Extract and typecast command line arguments
  const address = argv.address as string;
  const topic = argv.topic as string;
  const startBlock = argv.start as number;

  // Fetch the latest block number from Etherscan API
  const endblock = await EtherscanAPI.getLatestBlock();

  // Log the process of retrieving logs for user awareness
  console.log(`Getting logs from block ${startBlock} to ${endblock}`);
  
  // Fetch logs using the specified address, topic, start, and end block
  const logs = await EtherscanService.getLogsByAddressTopic(address, topic, startBlock, endblock);

  // Inform user about the number of logs found
  console.log(`Found ${logs.length} Logs`);

  // Writing the fetched logs to a file in JSON format for further analysis
  fs.writeFileSync("./data/logs.json", JSON.stringify(logs));
}

// Execute the main function
main();