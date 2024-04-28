// Utility to determine the base URL based on the request path and environment
export function getBaseUrl(requestPath: string) {
  let baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://blogstreak.com"
      : "http://localhost:3000";

  // Check if the first segment of the path is not "me"
  const pathSegments = requestPath.split("/");
  if (
    process.env.NODE_ENV === "production" &&
    !["me", "auth"].includes(pathSegments[1])
  ) {
    // Example: Extract subdomain from path or some other logic
    const subdomainUsername = pathSegments[1];
    baseUrl = `https://${subdomainUsername}.blogstreak.com`;
  }

  return baseUrl;
}
