export function resolveHttpErrorMessage(error: unknown, fallbackMessage: string) {
  if (typeof error !== 'object' || error === null) {
    return fallbackMessage;
  }
  if ('error' in error) {
    const apiMessage = extractApiMessage(error.error);
    if (apiMessage) {
      return apiMessage;
    }
  }
  if ('message' in error && typeof error.message === 'string' && error.message) {
    return error.message;
  }
  return fallbackMessage;
}

function extractApiMessage(responseBody: unknown) {
  if (typeof responseBody !== 'object' || responseBody === null || !('message' in responseBody)) {
    return '';
  }
  if (typeof responseBody.message === 'string') {
    return responseBody.message;
  }
  if (Array.isArray(responseBody.message)) {
    return responseBody.message.find(message => typeof message === 'string') || '';
  }
  return '';
}
