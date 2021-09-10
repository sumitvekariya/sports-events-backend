export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    host: '0.0.0.0',
    publicDir: process.cwd() + '/dist/hobbyst',
    srcDir: process.cwd() + '/tg/',
    baseDir: process.cwd() + '/data/',
    rethinkdb: {
      host: process.env.NODE_ENV === 'production' ? process.env.DB_URL : '127.0.0.1',
      port: parseInt(process.env.DB_PORT, 10) || 28015,
      authKey: '',
      db: process.env.DB_NAME || 'test',
      tables: ['users', 'places', 'channels', 'persistData', 'postMessages', 'events', 'eventPlayers', 'notifications', 'followers', 'friends']
    },
    TELEGRAM: {
      CONFIG: process.env.NODE_ENV === 'production' ? {
        token: process.env.TELEGRAM_TOKEN,
        launchOptions: {
          webhook: {
            domain: process.env.TELEGRAM_HOST,
            hookPath: process.env.TELEGRAM_TOKEN,
          }
        }
      } : {
        token: process.env.TELEGRAM_TOKEN
      },
      TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
      HOST: process.env.TELEGRAM_HOST,
      WEBHOOK_PORT: parseInt(process.env.WEB_HOOK_PORT, 10) || 8443,
      PATH_TO_KEY: process.cwd() + '/tls/server.key',
      PATH_TO_CERT: process.cwd() + '/tls/server.pem'
    },
    myId: parseInt(process.env.TG_ADMIN_ID, 10) || 253573611
});