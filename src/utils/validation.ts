export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export const isNonNegativeNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return false
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue >= 0
}

export const isValidDate = (value: string) => {
  if (!value) return false
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}

const friendlyFieldName = (value: string) => {
  const field = value.split('.').pop() || value
  return field.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

const friendlyDetail = (detail: unknown) => {
  if (typeof detail === 'string') return detail
  if (!detail || typeof detail !== 'object') return ''

  if ('msg' in detail) {
    const message = String(detail.msg)
    const location = 'loc' in detail && Array.isArray(detail.loc)
      ? String(detail.loc[detail.loc.length - 1] || '')
      : ''
    const field = location ? friendlyFieldName(location) : 'This value'

    if (/field required|required/i.test(message)) return `${field} is required.`
    if (/valid email/i.test(message)) return `Enter a valid ${field.toLowerCase()}.`
    if (/greater than or equal to 0|non-negative/i.test(message)) return `${field} must be zero or greater.`
    if (/at least (\d+) characters?/i.test(message)) return `${field} is too short.`
    return location ? `${field}: ${message}` : message
  }

  return ''
}

export const getApiErrorMessage = (body: unknown, fallback: string, status?: number) => {
  let parsedBody = body
  if (typeof body === 'string') {
    try {
      parsedBody = JSON.parse(body)
    } catch {
      return body.trim() || fallback
    }
  }

  if (parsedBody && typeof parsedBody === 'object') {
    const errorBody = parsedBody as Record<string, unknown>
    if ('detail' in errorBody) {
      const detail = errorBody.detail
      if (Array.isArray(detail)) {
        const messages = detail.map(friendlyDetail).filter(Boolean)
        if (messages.length) return messages.join(' ')
      }
      const message = friendlyDetail(detail)
      if (message) return message
    }
    for (const key of ['message', 'error']) {
      if (errorBody[key]) return String(errorBody[key])
    }
  }

  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'The requested record could not be found.'
  if (status === 409) return 'This record conflicts with existing data.'
  if (status !== undefined && status >= 500) return 'The server encountered a problem. Please try again.'
  return fallback
}

export const getResponseErrorMessage = async (response: Response, fallback: string) => {
  const text = await response.text()
  return getApiErrorMessage(text, fallback, response.status)
}
