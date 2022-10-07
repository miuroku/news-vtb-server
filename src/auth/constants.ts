// Move this sicrets to .env file and add configurationService later.

export const jwtConstants = {
  secret: 'secretKey',
  accessSecret: process.env.SECRET_JWT_ACCESS || 'test_1',
  refreshSecret: process.env.SECRET_JWT_REFRESH || 'test_2',
};