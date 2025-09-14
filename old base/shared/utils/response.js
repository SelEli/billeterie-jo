export function success(data, meta = {}) {
  return {
    status: "success",
    data,
    errors: [],
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
}

export function error(errors, code = 400, meta = {}) {
  return {
    status: "error",
    data: null,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
}
