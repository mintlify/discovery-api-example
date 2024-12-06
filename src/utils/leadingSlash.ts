export function optionallyRemoveLeadingSlash(path: string) {
  return path.startsWith('/') ? path.substring(1) : path;
}

export function optionallyAddLeadingSlash(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}
