export const functions = {
  query: function (requestUrl, queryParams) {
    // Construct the query string from the queryParams object
    let queryString = Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");

    // Add the query string to the URL if it exists
    let url = requestUrl;
    if (queryString) {
      url += `?${queryString}`;
    }
    return url;
  },
};
