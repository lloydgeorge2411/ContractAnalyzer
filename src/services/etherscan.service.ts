import { EtherscanAPI } from "@src/api/etherscan.api";
import { EtherscanEvent, InternalTransaction } from "@src/types/etherscan.type";

/**
 * EtherscanService class provides higher-level methods for interacting with various 
 * aspects of the Etherscan API, specifically focusing on fetching internal transactions 
 * and event logs for given Ethereum addresses over a range of block numbers.
 * 
 * These methods handle pagination and batching of requests, allowing for processing 
 * large ranges of data efficiently.
 */
export class EtherscanService {

  /**
   * Retrieves internal transactions for a specified Ethereum address within a range 
   * of blocks, processing them in batches of 10,000 blocks at a time.
   * 
   * This method efficiently handles large datasets by breaking down the request into 
   * smaller chunks, minimizing the load on the network and adhering to potential API 
   * rate limits.
   *
   * @param {string} address - The Ethereum address to query transactions for.
   * @param {number} startblock - The starting block number for the data retrieval.
   * @param {number} endblock - The ending block number for the data retrieval.
   * @returns {Promise<InternalTransaction[]>} A promise that resolves to an array of InternalTransaction objects.
   */
  static async getInternalTransactionsByAddress(
    address: string,
    startblock: number,
    endblock: number
  ): Promise<InternalTransaction[]> {
    try {
      let result: InternalTransaction[] = [];
      // Process blocks in chunks of 10,000
      for (let block = startblock; block <= endblock; block += 10000) {
        const start = block;
        // Ensure the end does not exceed the specified endblock
        const end = block + 9999 < endblock ? block + 9999 : endblock;
        console.log(`Processing from ${start} to ${end}`);

        // Fetch and accumulate internal transactions
        const data = await EtherscanAPI.getInternalTransactionsByAddress(address, start, end);
        result = [...result, ...data];
      }
      return result;
    } catch (error) {
      console.warn(
        `Warning: Could not fetch internal transactions for ${address}: ${error}`
      );
      return [];
    }
  }

  /**
   * Retrieves event logs for a specified Ethereum address and event topic within a 
   * range of blocks, processing them in batches of 1,000 blocks at a time.
   * 
   * This method is designed to efficiently handle large datasets by segmenting the 
   * request into smaller, manageable parts while ensuring complete data retrieval.
   *
   * @param {string} address - The Ethereum address to query logs for.
   * @param {string} topic - The event topic to filter logs by.
   * @param {number} startblock - The starting block number for the data retrieval.
   * @param {number} endblock - The ending block number for the data retrieval.
   * @returns {Promise<EtherscanEvent[]>} A promise that resolves to an array of EtherscanEvent objects.
   */
  static async getLogsByAddressTopic(
    address: string,
    topic: string,
    startblock: number,
    endblock: number
  ): Promise<EtherscanEvent[]> {
    try {
      let result: EtherscanEvent[] = [];
      // Process blocks in chunks of 1,000
      for (let block = startblock; block <= endblock; block += 1000) {
        const start = block;
        // Ensure the end does not exceed the specified endblock
        const end = block + 999 < endblock ? block + 999 : endblock;
        console.log(`Processing from ${start} to ${end}`);

        // Fetch and accumulate event logs
        const data = await EtherscanAPI.getLogsByAddressTopic(address, topic, start, end);
        result = [...result, ...data];
      }
      return result;
    } catch (error) {
      console.warn(
        `Warning: Could not fetch logs for ${address}: ${error}`
      );
      return [];
    }
  }
}