/**
 * Utility function `sleep` that pauses the execution of an asynchronous operation 
 * for a specified duration of time.
 * 
 * This is often useful in scenarios where you need to introduce a delay between 
 * subsequent network requests to avoid hitting rate limits, or to implement retries 
 * with a back-off strategy.
 * 
 * @param {number} milliseconds - The duration for which the execution should be paused, in milliseconds.
 * 
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const sleep = async (milliseconds: number): Promise<void> => {
  // If the given duration is less than or equal to 0, return immediately
  if (milliseconds <= 0) return;
  
  // Return a promise that resolves after the specified duration
  return new Promise((res) => {
    setTimeout(() => {
      res(); // Resolve the promise
    }, milliseconds);
  });
}