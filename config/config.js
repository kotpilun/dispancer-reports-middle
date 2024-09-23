const config = {
  development: {
    apiUrl: "mongodb://admin:secret@localhost:27017/dispancer?authSource=admin",
  },
  production: {
    apiUrl: "mongodb://mongo:27017/dispancer",
  },
};

const environment = process.env.NODE_ENV || "development";

export const { apiUrl } = config[environment];
