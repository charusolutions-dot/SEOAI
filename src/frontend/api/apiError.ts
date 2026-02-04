export interface ApiError extends Error {
  code?: string;
}

export const parseApiError = async (response: Response): Promise<ApiError> => {
  const error: ApiError = new Error("Request failed");

  try {
    const data = (await response.json()) as { error?: string; code?: string };
    if (data?.error) {
      error.message = data.error;
    }
    if (data?.code) {
      error.code = data.code;
    }
  } catch {
    // ignore JSON parse errors and keep default message
  }

  return error;
};
