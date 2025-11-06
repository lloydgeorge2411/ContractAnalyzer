/**
 * EtherscanConstants module that contains constant values used for 
 * interacting with the Etherscan API. This is used to define base URIs,
 * endpoints, and other static values that remain constant throughout
 * the application lifecycle.
 * 
 * Managing these constants in a dedicated module facilitates easy updates
 * and maintenance when API versions or host URLs change, promoting a 
 * single source of truth.
 */
export const EtherscanConstants = {
  // The base URL for accessing the Etherscan API, specifically targeting the main Ethereum network (chain ID 1)
  BASE_URL: "https://api.etherscan.io/v2/api?chainid=1"
}