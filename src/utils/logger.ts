export const logError = (context: string, error: unknown): void => {
  const normalized = error instanceof Error ? error : new Error(String(error));
  console.error(`[${context}]`, normalized);
};
