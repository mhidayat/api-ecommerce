
export const sanitizeInput = (str: string) => {
  return str.replaceAll("'", "''");
}