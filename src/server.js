const Hapi = require("@hapi/hapi");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const transactionsRoutes = require("./routes/transactionsRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const { processNewTransactions } = require('./controllers/predictionController');


const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
  });

  await server.register(require("@hapi/jwt"));

  // Define JWT authentication strategy
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: "urn:audience:users", // Optional audience check
      iss: "urn:issuer:api", // Optional issuer check
      sub: false, // Subject verification not required
    },
    validate: (artifacts, request, h) => {
      // Extract the user details from the token payload
      const user = artifacts.decoded.payload.user;
      if (!user || !user.id) {
        return { isValid: false }; // Token invalid if user or user.id is missing
      }
      return {
        isValid: true,
        credentials: { id: user.id }, // Pass user ID for use in handlers
      };
    },
  });
  
  server.auth.default("jwt");

  // Registrasi rute
  userRoutes(server);
  transactionsRoutes(server);

  await server.register(predictionRoutes);


  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
