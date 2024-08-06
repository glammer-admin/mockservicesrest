/**
 * Parses a URL-encoded form data string into a JavaScript object.
 * @param formData - The URL-encoded form data string.
 * @returns An object with key-value pairs.
 */
export function parseFormData(formData: string): Record<string, string> {
    const params = new URLSearchParams(formData);
    const parsedData: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      parsedData[key] = value;
    }

    return parsedData;
  }
