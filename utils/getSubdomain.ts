export function getSubdomain(hostname: string | null) {
  if (!hostname) {
    return null;
  }
  const parts = hostname.split(".");
  if (parts.length >= 3 && parts[0] !== "www") {
    return parts[0];
  }
  return null;
}
