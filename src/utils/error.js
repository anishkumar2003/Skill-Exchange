export function formatError(error, context = "") {
  if (!error) {
    return {
      success: false,
      message: "Unknown error occurred",
      code: "UNKNOWN",
      context,
    };
  }

  return {
    success: false,
    message: error?.message || "Something went wrong",
    code: error?.code || "ERROR",
    context,
  };
}
