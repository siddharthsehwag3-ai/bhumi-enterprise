const LOCAL_SITE_URL = "http://localhost:3000";

function addProtocol(value: string) {
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://${value}`;
}

function removeTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return removeTrailingSlash(
      addProtocol(configuredUrl),
    );
  }

  const productionUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (productionUrl) {
    return removeTrailingSlash(
      addProtocol(productionUrl),
    );
  }

  const deploymentUrl = process.env.VERCEL_URL?.trim();

  if (deploymentUrl) {
    return removeTrailingSlash(
      addProtocol(deploymentUrl),
    );
  }

  return LOCAL_SITE_URL;
}

export function createAbsoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}