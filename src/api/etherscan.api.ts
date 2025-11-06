import { Environment } from "@src/constants/environment";
import { EtherscanConstants } from "@src/constants/etherscan.constants";
import { EtherscanEvent, InternalTransaction } from "@src/types/etherscan.type";
import { sleep } from "@src/utils/general.utils";
import axios from "axios";

/**
 * EtherscanAPI class encapsulates the interaction with the Etherscan API,
 * providing methods to fetch blockchain data such as latest block numbers,
 * internal transactions, and event logs by address and topic.
 */
export class EtherscanAPI {

  /**
   * Retrieves the latest block number from the Ethereum blockchain.
   *
   * Makes an HTTP GET request to the Etherscan API proxy module querying the current block number.
   * Converts the hexadecimal block number to a decimal number before returning. 
   * Logs any errors encountered during the request.
   *
   * @returns {Promise<number>} Promise that resolves to the latest block number.
   */
  static async getLatestBlock(): Promise<number> {
    try {
      const response = await axios.get(
        EtherscanConstants.BASE_URL,
        {
          params: {
            module: "proxy",
            action: "eth_blockNumber",
            apikey: Environment.ETHERSCAN_API_KEY,
          },
        }
      );

      // Convert the hexadecimal block number to a decimal
      if (response.data.result) {
        return parseInt(response.data.result, 16);
      }
      throw new Error("Failed to get latest block number");
    } catch (error) {
      throw new Error(`Error fetching latest block: ${error}`);
    }
  }

  /**
   * Retrieves internal transactions for a specific address within a given block range.
   *
   * Sends an HTTP GET request to the Etherscan API querying internal transactions.
   * Implements a retry mechanism in case of a NOTOK response, pausing for a second before retrying.
   * Returns a list of internal transactions or an empty list if an error occurs.
   *
   * @param {string} address - The Ethereum address to fetch transactions for.
   * @param {number} startblock - The block number to start from.
   * @param {number} endblock - The block number to end at.
   * @returns {Promise<InternalTransaction[]>} Promise that resolves to an array of InternalTransactions.
   */
  static async getInternalTransactionsByAddress(
    address: string,
    startblock: number,
    endblock: number
  ): Promise<InternalTransaction[]> {
    try {
      const response = await axios.get(
        EtherscanConstants.BASE_URL,
        {
          params: {
            module: "account",
            action: "txlistinternal",
            address: address,
            apikey: Environment.ETHERSCAN_API_KEY,
            startblock: startblock,
            endblock: endblock,
          },
        }
      );

      // Retry if the response indicates a temporary failure
      if (response.data.status === "0" && response.data.message.slice(0, 5) === "NOTOK") {
        console.log("Wait for 1 second and retry");
        await sleep(1000);
        const result = await this.getInternalTransactionsByAddress(address, startblock, endblock);
        return result;
      }

      // Successful fetch returns internal transaction results
      if (response.data.status === "1") {
        return response.data.result;
      }

      // Return an empty list if no transactions are found
      return [];
    } catch (error) {
      console.warn(
        `Warning: Could not fetch internal transactions for ${address}: ${error}`
      );
      return [];
    }
  }

  /**
   * Retrieves event logs for a specific address and topic within a given block range.
   *
   * Sends an HTTP GET request to the Etherscan API querying logs based on the specified parameters.
   * Implements a retry mechanism in case of a NOTOK response, pausing for a second before retrying.
   * Returns a list of logs or an empty list if an error occurs.
   *
   * @param {string} address - The Ethereum address to fetch logs for.
   * @param {string} topic - The event topic to filter logs.
   * @param {number} startblock - The block number to start from.
   * @param {number} endblock - The block number to end at.
   * @returns {Promise<EtherscanEvent[]>} Promise that resolves to an array of EtherscanEvents.
   */
  static async getLogsByAddressTopic(
    address: string,
    topic: string,
    startblock: number,
    endblock: number
  ): Promise<EtherscanEvent[]> {
    try {
      const response = await axios.get(
        EtherscanConstants.BASE_URL,
        {
          params: {
            module: "logs",
            action: "getLogs",
            fromBlock: startblock,
            toBlock: endblock,
            address: address,
            topic0: topic,
            apikey: Environment.ETHERSCAN_API_KEY,
          },
        }
      );

      // Retry if the response indicates a temporary failure
      if (response.data.status === "0" && response.data.message.slice(0, 5) === "NOTOK") {
        console.log("Wait for 1 second and retry");
        await sleep(1000);
        const result = await this.getLogsByAddressTopic(address, topic, startblock, endblock);
        return result;
      }

      // Successful fetch returns log results
      if (response.data.status === "1") {
        return response.data.result;
      }

      // Return an empty list if no logs are found
      return [];
    } catch (error) {
      console.warn(
        `Warning: Could not fetch logs for ${address}: ${error}`
      );
      return [];
    }
  }
}