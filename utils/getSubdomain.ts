export function getSubdomain(hostname: string | null) {
  if (!hostname) {
    return null;
  }
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
}
