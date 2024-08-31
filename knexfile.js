export const development = {
    client: 'sqlite3',
    connection: {
        filename: './database.sqlite'
    },
    migrations: {
        directory: './src/migrations'
    },
    useNullAsDefault: true
};
  