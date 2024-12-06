import { optionallyAddLeadingSlash } from './leadingSlash';

export function optionallyAddBaseUrl(baseUrl: string, url: string) {
  // absolute urls
  if (url.startsWith('https://')) return url;

  const urlWithLeadingSlash = optionallyAddLeadingSlash(url);
  return `${baseUrl}${urlWithLeadingSlash}`;
}
