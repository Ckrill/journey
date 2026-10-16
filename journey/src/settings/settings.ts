export const settings = {
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
  accessTokenManagement:
    import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN_MANAGEMENT || '',
  baseURL: 'https://cdn.contentful.com',
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
  limit: 1000,
  production: true,
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
};
