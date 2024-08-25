export const handleApiError = (error) => {
  if (error) {
    const { message, errors } = error;
    return { message, errors };
  }
  return { message: "An unexpected error occurred", errors: {} };
};
