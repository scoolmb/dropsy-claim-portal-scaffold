type ParsedAnchorError = {
  code?: string;
  number?: number;
  message?: string;
};

export function parseAnchorError(logs: string[]): ParsedAnchorError | null {
  for (const log of logs) {
    const match = log.match(
      /Error Code: (\w+)\. Error Number: (\d+)\. Error Message: (.+)/
    );

    if (match) {
      return {
        code: match[1],
        number: Number(match[2]),
        message: match[3],
      };
    }
  }

  return null;
}