import * as http from "http";
import * as dotenv from "dotenv";
dotenv.config();
import { getAllUsers, createUser, getUser, updateUser, deleteUser } from "./controllers/controllers";
import {
  METHODS,
  BASE_URL,
  STATUS_CODES
} from "./constants/index";

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.method === METHODS.GET && req.url === BASE_URL) {
    getAllUsers(req, res);
  }
  else if (req.method === METHODS.POST && req.url === BASE_URL) {
    createUser(req, res);
  }
  else if (req.method === METHODS.GET && req.url.split("/").length === 4) {
    const userId = req.url.split("/")[3];
    getUser(req, res, userId);
  }
  else if (req.method === METHODS.PUT && req.url.split("/").length === 4) {
    const userId = req.url.split("/")[3];
    updateUser(req, res, userId);
  }
  else if (req.method === METHODS.DELETE && req.url.split("/").length === 4) {
    const userId = req.url.split("/")[3];
    deleteUser(req, res, userId);
  }
  else {
    res.writeHead(STATUS_CODES.NOT_FOUND, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({ message: "Endpoint is not found" }));
  }
});

server.listen(PORT, () => console.log(`Server is running on ${PORT}`));

export default server;