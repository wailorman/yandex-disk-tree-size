const querystring = require('querystring');
const uuid = require('uuid');
const axios = require('axios');

const { YANDEX_API_ID, YANDEX_API_SECRET } = process.env;

exports.generateAuthUrl = (args) => {
  const { redirectUrl } = args;
  return `https://oauth.yandex.ru/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: YANDEX_API_ID,
    device_id: uuid(),
    device_name: 'browser',
    redirect_uri: redirectUrl,
  })}`;
};

exports.getToken = async (args) => {
  const { code, refreshToken } = args;

  if (code) {
    let tokenResponse;
    try {
      tokenResponse = await axios({
        url: 'https://oauth.yandex.ru/token',
        method: 'POST',
        data: querystring.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: YANDEX_API_ID,
          client_secret: YANDEX_API_SECRET,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: YANDEX_API_ID,
          password: YANDEX_API_SECRET,
        },
      });

      return tokenResponse.data;
    } catch (e) {
      throw new Error(`Yandex API error: ${e.response.data.error_description}`);
    }
  } else if (refreshToken) {
    let tokenResponse;
    try {
      tokenResponse = await axios({
        url: 'https://oauth.yandex.ru/token',
        method: 'POST',
        data: querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: YANDEX_API_ID,
          client_secret: YANDEX_API_SECRET,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: YANDEX_API_ID,
          password: YANDEX_API_SECRET,
        },
      });

      return tokenResponse.data;
    } catch (e) {
      throw new Error(`Yandex API error: ${e.response.data.error_description}`);
    }
  } else {
    throw new Error('Missing code or refreshToken');
  }
};

exports.getResourceInfo = async (args = {}, ctx = {}) => {
  const { path } = args;
  const { accessToken } = ctx;

  const { data } = await axios({
    url: 'https://cloud-api.yandex.net/v1/disk/resources',
    method: 'GET',
    params: {
      path,
      fields: 'name,resource_id,path,type,_embedded',
      limit: 100000,
    },
    headers: {
      Authorization: `OAuth ${accessToken}`,
    },
  });

  return data;
};
