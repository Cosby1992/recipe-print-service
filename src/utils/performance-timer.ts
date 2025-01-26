export const startTimer = (name?: string) => {
  const start = performance.now();
  return {
    stop: () => {
      return performance.now() - start;
    },
    log: () => {
      const elapsed = performance.now() - start;
      console.log(`${name ? name + ': ' : ''}Elapsed time: ${elapsed.toFixed(2)} ms`); // Log to console
    },
  };
};
