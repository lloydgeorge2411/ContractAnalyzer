import { config } from "dotenv";

// Load environment variables from a .env file into process.env
config();

/**
 * Environment module that encapsulates configuration variables
 * loaded from the environment. This setup is essential for managing
 * sensitive information such as API keys.
 * 
 * The `EtherscanAPIKey` is loaded from environment variables, providing
 * a convenient and secure way to manage API keys without hardcoding them 
 * in the source code.
 */
export const Environment = {
  // Retrieve the Etherscan API key from the environment variables, defaulting to an empty string if undefined
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY ?? ""
}