export const readResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string'
      ? body
      : body?.message || 'Something went wrong';
    throw new Error(message);
  }

  return body as T;
};
