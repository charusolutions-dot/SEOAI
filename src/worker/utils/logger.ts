export const logInfo = (message: string, meta?: Record<string, unknown>) => {
  if (meta) {
    console.log(`[worker] ${message}`, meta);
    return;
  }
  console.log(`[worker] ${message}`);
};

export const logWarn = (message: string, meta?: Record<string, unknown>) => {
  if (meta) {
    console.warn(`[worker] ${message}`, meta);
    return;
  }
  console.warn(`[worker] ${message}`);
};

export const logError = (message: string, meta?: Record<string, unknown>) => {
  if (meta) {
    console.error(`[worker] ${message}`, meta);
    return;
  }
  console.error(`[worker] ${message}`);
};
