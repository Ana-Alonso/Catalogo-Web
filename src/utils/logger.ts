export const logError = (context: string, error: unknown): void => {
  if (error instanceof Error) {
    console.error(`[${context}]`, error);
    return;
  }
  if (typeof error === 'object' && error !== null) {
    try {
      console.error(`[${context}]`, JSON.stringify(error));
    } catch {
      console.error(`[${context}]`, error);
    }
    return;
  }
  console.error(`[${context}]`, new Error(String(error)));
};
