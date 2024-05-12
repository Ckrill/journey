export const settings = {
  baseURL: 'https://cdn.contentful.com',
  limit: 1000,
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID || '',
  environment: 'master',
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN || '',
  accessTokenManagement:
    process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN_MANAGEMENT || '',
  production: true,
};
