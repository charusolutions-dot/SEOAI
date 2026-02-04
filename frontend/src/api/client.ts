export interface ApiError extends Error {
  code?: string;
}

const API_BASE_URL = "http://localhost:3000";

export const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
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
      // ignore parse errors
    }
    throw error;
  }

  return response.json() as Promise<T>;
};

export const requestBlob = async (path: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include"
  });

  if (!response.ok) {
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
      // ignore parse errors
    }
    throw error;
  }

  return response.blob();
};
