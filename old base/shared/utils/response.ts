// utils/response.ts
export function success(data: any, meta = {}) {
  return {
    status: "success",
    data,
    errors: [],
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  }
}

export function error(errors: any[], code = 400, meta = {}) {
  return {
    status: "error",
    data: null,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  }
}
