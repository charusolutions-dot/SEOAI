const urlRegex = /(https?:\/\/|www\.)\S+/i;
const bulletRegex = /^\s*[-*•]/m;
const headingRegex = /^\s*#{1,6}\s+/m;

export const isValidExplanation = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount > 120) {
    return false;
  }

  if (urlRegex.test(trimmed)) {
    return false;
  }

  if (bulletRegex.test(trimmed)) {
    return false;
  }

  if (headingRegex.test(trimmed)) {
    return false;
  }

  const sentences = trimmed.split(/[.!?]+\s/).filter(Boolean);
  if (sentences.length > 3) {
    return false;
  }

  return true;
};
