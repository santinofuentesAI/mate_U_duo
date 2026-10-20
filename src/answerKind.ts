export function usesNumberPad(answer: string | string[]): boolean {
  if (Array.isArray(answer)) return false;
  return /^[\d\s,.\-−/]+$/.test(answer.trim()) && /\d/.test(answer);
}

export function numericParts(value: string): string[] {
  return value.split(/[;,]/).map(part => part.trim()).filter(Boolean);
}
