require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const connection = require("./config/db");

connection();

const app = express();
const httpServer = createServer(app);

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-business-os-r89y.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({limit : '10mb'}));
app.use(express.urlencoded({ extended: true , limit:'10mb'}));
app.use(cookieParser());

// Routes
const prefix = "/api";

app.use(prefix + '/admin' , require('./routes/user/adminRoutes'))
app.use(prefix + "/partners", require("./routes/user/partnerRoutes"));
app.use(prefix + "/members", require("./routes/user/memberRoutes"));
app.use(prefix + "/login", require("./routes/login"));

app.get(prefix + "/test", (req, res) => res.send("✅ Test OK with prefix"));

// Start server
const PORT = process.env.PORT || 9999;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
