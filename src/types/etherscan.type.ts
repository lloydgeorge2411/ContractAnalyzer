/**
 * Interface definition for an EtherscanTransaction, representing the structure of a transaction
 * retrieved from Etherscan API.
 *
 * This interface encapsulates all relevant fields required for detailed analysis and 
 * understanding of a blockchain transaction, including meta-information such as block and 
 * transaction index, and technical details like gas used and transaction inputs.
 */
export interface EtherscanTransaction {
  blockNumber: string;         // The block number in which the transaction was included
  timeStamp: string;           // Unix timestamp of when the transaction was confirmed
  hash: string;                // The unique transaction hash
  nonce: string;               // The nonce of the sender used for this transaction
  blockHash: string;           // The hash of the block that contains this transaction
  transactionIndex: string;    // The transaction index within the block
  from: string;                // The address of the sender
  to: string;                  // The address of the receiver
  value: string;               // The value transferred in the transaction, denominated in wei
  gas: string;                 // The gas limit provided by the sender
  gasPrice: string;            // The price per unit of gas paid by the sender in wei
  gasUsed: string;             // The actual amount of gas used by the transaction
  cumulativeGasUsed: string;   // The total gas used when this transaction was executed in the block
  input: string;               // The data input to the transaction, often used for contract calls
  confirmations: string;       // The number of confirmations since the transaction was included in a block
  isError: string;             // Indicates if the transaction resulted in an error (0 = no error, 1 = error occurred)
}

/**
 * Interface definition for an InternalTransaction, representing the structure of an internal 
 * transaction retrieved from Etherscan API.
 *
 * Designed to capture internal transaction details, particularly for contract interactions 
 * or transactions that occur as a result of another transaction's execution.
 */
export interface InternalTransaction {
  blockNumber: string;         // The block number where the internal transaction occurred
  timeStamp: string;           // Unix timestamp of when the internal transaction was confirmed
  hash: string;                // The transaction hash that triggered this internal transaction
  from: string;                // The address initiating the internal transaction
  to: string;                  // The destination address or contract of the internal transaction
  value: string;               // The value transferred in the internal transaction, denominated in wei
  contractAddress: string;     // The contract address that created this internal transaction, if applicable
  input: string;               // The input data if any, relevant for contract interactions
  type: string;                // The type of internal transaction, e.g., call, delegatecall
  gas: string;                 // The gas limit for the internal transaction
  gasUsed: string;             // The amount of gas used for the internal transaction
  traceId: string;             // The trace identifier for deeper analysis of the internal transaction
  isError: string;             // Error flag indicating the transaction success status (0 = no error, 1 = error occurred)
  errCode: string;             // The specific error code if an error occurred
}

/**
 * Interface definition for an EtherscanEvent, representing the structure of a log/event 
 * retrieved from Etherscan API.
 *
 * Captures essential information about event logs emitted during contract execution, 
 * which includes the originating address and associated topics for event filtering and identification.
 */
export interface EtherscanEvent {
  address: string;             // The address of the contract that generated the event
  topics: string[];            // An array of topics associated with the event for filtering
  data: string;                // Additional data associated with the event in hex
  blockNumber: string;         // The block number where the event was logged
  timeStamp: string;           // Unix timestamp of when the event was logged
  gasPrice: string;            // The gas price in wei used at the time of the event
  gasUsed: string;             // The amount of gas used to log the event
  logIndex: string;            // The index of the log within the transaction
  transactionHash: string;     // The hash of the transaction that generated the event
  transactionIndex: string;    // The index of the transaction within the block
}