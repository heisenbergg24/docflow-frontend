/**
 * Classify an error thrown during a fetch and return a user-friendly message.
 *
 * Categories:
 *  - Network error  → browser couldn't reach the server at all (offline / CORS / timeout)
 *  - Server error   → backend replied with 4xx / 5xx (pass the server text through)
 *  - Unknown        → anything else
 */
export function getErrorMessage(err, serverResponseText = '') {
  // 1. Network / connectivity issue — fetch itself threw
  //    Typical messages: "Failed to fetch", "Load failed", "NetworkError", "net::ERR_*"
  if (err instanceof TypeError) {
    const msg = err.message?.toLowerCase() || ''
    if (
      msg.includes('failed to fetch') ||
      msg.includes('load failed') ||
      msg.includes('networkerror') ||
      msg.includes('network request failed') ||
      msg.includes('err_') ||
      msg.includes('timeout') ||
      msg.includes('abort')
    ) {
      return {
        type: 'network',
        title: 'Network Error',
        message:
          "Couldn't reach the server. Please check your internet connection and try again.",
      }
    }
  }

  // 2. AbortError — request timed out
  if (err?.name === 'AbortError') {
    return {
      type: 'network',
      title: 'Request Timed Out',
      message:
        'The request took too long to complete. Please check your connection and try again.',
    }
  }

  // 3. Server returned an error response (4xx / 5xx)
  //    Caller passes the response.text() as serverResponseText
  if (serverResponseText) {
    const text = serverResponseText.trim()
    // Keep server message only if it's short and readable
    const friendly =
      text.length > 0 && text.length < 250 && !text.startsWith('<')
        ? text
        : 'The server encountered a problem processing your file.'

    return {
      type: 'server',
      title: 'Server Error',
      message: `${friendly} This is a backend issue — please try again in a moment.`,
    }
  }

  // 4. Generic / unknown error
  const raw = err?.message || ''
  const isTechnical = raw.length > 200 || raw.startsWith('<') || !raw
  return {
    type: 'unknown',
    title: 'Something Went Wrong',
    message: isTechnical
      ? 'An unexpected error occurred. Please try again in a few seconds.'
      : raw,
  }
}
