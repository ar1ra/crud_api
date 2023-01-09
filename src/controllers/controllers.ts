import { ServerResponse, IncomingMessage } from "node:http";
import { db } from "../db/db.js";
import { v4 as uuid } from "uuid";
import { STATUS_CODES } from "../constants/index.js";
import { mathId } from "../utils/index.js";

const getAllUsers = (req: IncomingMessage, res: ServerResponse) => {
  try {
    return res.writeHead(STATUS_CODES.SUCCESS, {
      "Content-Type": "application/json"
    }).end(JSON.stringify(db));
  } catch (error) {
    return res.writeHead(STATUS_CODES.SERVER_ERROR, {
      "Content-Type": "application/json"
    }).end(JSON.stringify({ message: "Something went wrong" }));
  }
};

const createUser = (req: IncomingMessage, res: ServerResponse) => {
  try {
    let body = "";
    req.on("data", (data) => {
      body += data.toString();
    });
    req.on("end", () => {
      if (body) {
        try {
          const data = JSON.parse(body);
          if (
            data.name &&
            data.age &&
            data.hobbies
          ) {
            const createdUser = {
              id: uuid(),
              ...JSON.parse(body)
            };

            db.push(createdUser);
            return res.writeHead(STATUS_CODES.CREATED, {
              "Content-Type": "application/json"
            }).end(JSON.stringify(createdUser));
          }
          else {
            return res.writeHead(STATUS_CODES.BAD_REQUEST, {
              "Content-Type": "application/json"
            }).end(JSON.stringify({ message: "Name, age, hobbies are required" }));
          }
        } catch (error) {
          return res.writeHead(STATUS_CODES.SERVER_ERROR, {
            "Content-Type": "application/json"
          }).end(JSON.stringify({ message: "Something went wrong" }));
        }
      }
      else {
        return res.writeHead(STATUS_CODES.BAD_REQUEST, {
          "Content-Type": "application/json"
        }).end(JSON.stringify({ message: "Name, age, hobbies are required" }));
      }
    });

    req.on("error", () => {
      return res.writeHead(STATUS_CODES.SERVER_ERROR, {
        "Content-Type": "application/json"
      }).end(JSON.stringify({ message: "Something went wrong" }));
    });
  } catch (error) {
    return res.writeHead(STATUS_CODES.SERVER_ERROR, {
      "Content-Type": "application/json"
    }).end(JSON.stringify({ message: "Something went wrong" }));
  }
};

const getUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (mathId(id)) {
      const user = db.find(el => el.id === id);
      if (!user) {
        return res.writeHead(STATUS_CODES.NOT_FOUND, {
          "Content-Type": "application/json"
        }).end(JSON.stringify({ message: `User with ID: ${id} not found` }));
      }

      return res.writeHead(STATUS_CODES.SUCCESS, {
        "Content-Type": "application/json"
      }).end(JSON.stringify(user));
    }

    return res.writeHead(STATUS_CODES.BAD_REQUEST, {
      "Content-Type": "application/json"
    }).end(JSON.stringify({ message: "User ID is invalid" }));
  } catch (error) {
    return res.writeHead(STATUS_CODES.SERVER_ERROR, {
      "Content-Type": "application/json"
    }).end(JSON.stringify({ message: "Something went wrong" }));
  }
};

const updateUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (mathId(id)) {
      let body = "";
      req.on("data", (data) => {
        body += data.toString();
      });
      req.on("end", () => {
        const user = db.find(el => el.id === id);
        if (!user) {
          return res.writeHead(STATUS_CODES.NOT_FOUND, {
            "Content-Type": "application/json"
          }).end(JSON.stringify({ message: `User with ID: ${id} not found` }));
        }
        else {
          if (body) {
            try {
              const data = JSON.parse(body);
              const userIndex = db.findIndex(el => el.id === id);

              const updatedUser = {
                id,
                name: data.name || user.name,
                age: data.age || user.age,
                hobbies: data.hobbies || user.hobbies
              };

              db[userIndex] = updatedUser;

              return res.writeHead(STATUS_CODES.SUCCESS, {
                "Content-Type": "application/json"
              }).end(JSON.stringify(updatedUser));
            } catch (error) {
              return res.writeHead(STATUS_CODES.SERVER_ERROR, {
                "Content-Type": "application/json"
              }).end(JSON.stringify({ message: "Something went wrong" }));
            }
          }
          else {
            return res.writeHead(STATUS_CODES.NO_CONTENT, {
              "Content-Type": "application/json"
            }).end();
          }
        }
      });

      req.on("error", (error) => {
        return res.writeHead(STATUS_CODES.SERVER_ERROR, {
          "Content-Type": "application/json"
        }).end(JSON.stringify({ message: "Something went wrong" }));
      });
    }
    else {
      return res.writeHead(STATUS_CODES.BAD_REQUEST, {
        "Content-Type": "application/json"
      }).end(JSON.stringify({ message: "User ID is invalid" }));
    }
  } catch (error) {
    return res.writeHead(STATUS_CODES.SERVER_ERROR, {
      "Content-Type": "application/json"
    }).end(JSON.stringify({ message: "Something went wrong" }));
  }
};

const deleteUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (mathId(id)) {
      const user = db.find(el => el.id === id);
      if (!user) {
        return res.writeHead(STATUS_CODES.NOT_FOUND, {
          "Content-Type": "application/json"
        }).end(JSON.stringify({ message: `User with ID: ${id} not found` }));
      }

      const deletedUserIndex = db.findIndex(el => el.id === user.id);
      db.splice(deletedUserIndex, 1);

      return res.writeHead(STATUS_CODES.NO_CONTENT, {
        "Content-Type": "application/json"
      }).end();
    }

    return res.writeHead(STATUS_CODES.BAD_REQUEST, {
      "Content-Type": "application/json"
    }).end(JSON.stringify({ message: "User ID is invalid" }));
  } catch (error) {
    return res.writeHead(STATUS_CODES.SERVER_ERROR, {
      "Content-Type": "application/json"
    }).end(JSON.stringify({ message: "Something went wrong" }));
  }
};

export {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
}

