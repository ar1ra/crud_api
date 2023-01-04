import db from "../db/db.json" assert {type: "json"};
import { v4 as uuid } from "uuid";
import { STATUS_CODES } from "../constants/index.js";
import { mathId } from "../utils/index.js";

const getAllUsers = (req, res) => {
  return res.writeHead(STATUS_CODES.SUCCESS, {
    "Content-Type": "application/json"
  }).end(JSON.stringify(db));
};

const createUser = (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body += data.toString();
  });
  req.on("end", () => {
    if (body) {
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
        }).end("Name, age, hobbies are required");
      }
    }
    else {
      return res.writeHead(STATUS_CODES.BAD_REQUEST, {
        "Content-Type": "application/json"
      }).end("Name, age, hobbies are required");
    }
  });

  req.on("error", () => {
    return res.writeHead(STATUS_CODES.SERVER_ERROR, {
      "Content-Type": "application/json"
    }).end("Something went wrong");
  });
};

const getUser = (req, res, id) => {
  if (mathId(id)) {
    const user = db.find(el => el.id === id);
    if (!user) {
      return res.writeHead(STATUS_CODES.NOT_FOUND, {
        "Content-Type": "application/json"
      }).end(`User with ID: ${id} not found`);
    }

    return res.writeHead(STATUS_CODES.SUCCESS, {
      "Content-Type": "application/json"
    }).end(JSON.stringify(user));
  }

  return res.writeHead(STATUS_CODES.BAD_REQUEST, {
    "Content-Type": "application/json"
  }).end("Wrong user ID");
};

const updateUser = (req, res, id) => {
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
        }).end(`User with ID: ${id} not found`);
      }
      else {
        if (body) {
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
        }
        else {
          return res.writeHead(STATUS_CODES.SUCCESS, {
            "Content-Type": "application/json"
          }).end("No body");
        }
      }
    });

    req.on("error", (error) => {
      return res.writeHead(STATUS_CODES.SERVER_ERROR, {
        "Content-Type": "application/json"
      }).end(JSON.stringify(error));
    });
  }
  else {
    return res.writeHead(STATUS_CODES.BAD_REQUEST, {
      "Content-Type": "application/json"
    }).end("Wrong user ID");
  }
};

const deleteUser = (req, res, id) => {
  if (mathId(id)) {
    const user = db.find(el => el.id === id);
    if (!user) {
      return res.writeHead(STATUS_CODES.NOT_FOUND, {
        "Content-Type": "application/json"
      }).end(`User with ID: ${id} not found`);
    }
    
    const deletedUserIndex = db.findIndex(el => el.id === user.id);
    db.splice(deletedUserIndex, 1);

    return res.writeHead(STATUS_CODES.DELETED, {
      "Content-Type": "application/json"
    }).end();
  }

  return res.writeHead(STATUS_CODES.BAD_REQUEST, {
    "Content-Type": "application/json"
  }).end("Wrong user ID");
};

export {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
}

