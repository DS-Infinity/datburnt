const config = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI,
  allowedOrigins:
    process.env.NODE_ENV == 'production'
      ? ['https://minet-metaverse.vercel.app']
      : ['http://localhost:3001'],
  cookieConfig:
    process.env.NODE_ENV == 'production'
      ? {
          httpOnly: true,
          maxAge: 15552000000,
          secure: true,
          sameSite: 'none',
        }
      : { httpOnly: true, maxAge: 15552000000 },
  removeCookieConfig:
    process.env.NODE_ENV == 'production'
      ? { sameSite: 'none', secure: true }
      : {},
};

module.exports = config;
