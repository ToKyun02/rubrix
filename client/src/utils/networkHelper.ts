import ky, { HTTPError } from 'ky';

export const api = ky.create({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

export function getHttpStatus(error: unknown): number | null {
  return error instanceof HTTPError ? error.response.status : null;
}

export const isHttpNotFound = (error: unknown) => getHttpStatus(error) === 404;

export const isClientError = (error: unknown) => {
  const status = getHttpStatus(error);
  return status !== null && status >= 400 && status < 500;
};
