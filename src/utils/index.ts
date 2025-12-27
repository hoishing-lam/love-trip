export function parseURL(url: string) {
  const queryIndex = url.indexOf('?');

  let urlWithoutQuery = url;
  let queryString = '';
  if (queryIndex >= 0) {
    urlWithoutQuery = url.substring(0, queryIndex);
    queryString = url.substring(queryIndex + 1);
  }

  const urlSearchParams = new URLSearchParams(queryString);

  return {
    path: urlWithoutQuery,
    query: Array.from(urlSearchParams.keys()).reduce(
      (prev, key) => {
        prev[key] = urlSearchParams.get(key);
        return prev;
      },
      {} as Record<string, any>
    )
  };
}
