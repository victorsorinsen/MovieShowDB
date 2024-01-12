const api_key = '6a77f5a2cdf1a150f808f73c35533a92';
const imageBaseURL = 'http://image.tmdb.org/t/p/';

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParam));
};

export { imageBaseURL, api_key, fetchDataFromServer };
