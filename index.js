import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as ChildController from "./controllers/ChildController.js";
import * as DispancerController from "./controllers/DispancerController.js";
import { childCreateValidator } from "./validations/child.js";
import { createDoc } from "./controllers/createDoc.js";
import { apiUrl } from "./config/config.js";

mongoose;
//   .connect("mongodb://admin:secret@localhost:27017/dispancer?authSource=admin")

mongoose
  .connect(apiUrl)
  .then(() => console.log("DB STARTED ON PORT 27017"))
  .catch((err) => console.log("DB ERROR: ", err));

const PORT = 4444;
const app = express();

app.use(express.json());
// app.use(cors({ origin: 'http://localhost:5173' }));
app.use(
  cors({
    origin: "*", // Разрешает запросы от всех доменов, но лучше указать конкретный домен, если это возможно
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/children", ChildController.getAllChildren);
app.post("/children", childCreateValidator, ChildController.postChild);
app.post("/docs", createDoc);
app.patch("/children/:id", childCreateValidator, ChildController.updateChild);
app.delete("/children/:id", ChildController.deleteChild);

app.get("/dispancer", DispancerController.getAllDispancers);
app.post("/dispancer", DispancerController.postDispancer);

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    return console.log("ERROR");
  }
  console.log("SERVER OK ON PORT: ", PORT);
});
