export const settings = {
  baseURL: 'https://cdn.contentful.com',
  limit: 1000,
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  environment: 'master',
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
  accessTokenManagement:
    import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN_MANAGEMENT || '',
  production: true,
};
