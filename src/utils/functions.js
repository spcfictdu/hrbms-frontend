export const functions = {
  query: function (requestUrl, queryParams = {}) {
    if (!queryParams) return requestUrl;

    // URLSearchParams handles escaping of keys and values (spaces, &, #, etc.).
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      if (value === null || value === undefined) return;

      // Keep the previous comma-joined representation for array params
      // (e.g. dateRange=[from, to] -> dateRange=from,to).
      params.append(key, Array.isArray(value) ? value.join(",") : String(value));
    });

    const queryString = params.toString();
    if (!queryString) return requestUrl;

    const separator = requestUrl.includes("?") ? "&" : "?";
    return `${requestUrl}${separator}${queryString}`;
  },
};
