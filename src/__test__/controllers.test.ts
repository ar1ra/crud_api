import request from "supertest";
import server from "..";
import { IUser } from "../interfaces";

describe("Scenario 1:", () => {
  describe("GET /users", () => {
    test("should return empty array", async () => {
      const response = await request(server).get("/api/users");
      expect(response.body).toEqual([]);
    });
  });

  describe("POST /users", () => {
    test("should return created user", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const data: IUser = response.body;
      expect(response.body).toEqual({
        id: data.id,
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
    });
  });

  describe("GET /users/userId", () => {
    test("should return specific user", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const { id: userId }: IUser = response.body;

      const getUserResponse = await request(server).get(`/api/users/${userId}`);
      expect(getUserResponse.body).toEqual(response.body);
    });
  });

  describe("PUT /users/userId", () => {
    test("should update the user without changing userID", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const { id: userId }: IUser = response.body;

      const putUserResponse = await request(server).put(`/api/users/${userId}`).send({
        name: "New User"
      });

      expect(userId).toEqual(putUserResponse.body.id);
    });
  })

  describe("DELETE /users/userId", () => {
    test("should delete the user", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const { id: userId }: IUser = response.body;

      const deleteUserResponse = await request(server).delete(`/api/users/${userId}`);
      expect(deleteUserResponse.statusCode).toBe(204);
    });

    test("should return a message, that there is no such user'", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const { id: userId }: IUser = response.body;

      await request(server).delete(`/api/users/${userId}`);
      const deleteSameUserResponse = await request(server).delete(`/api/users/${userId}`);
      expect(deleteSameUserResponse.body).toEqual({
        message: `User with ID: ${userId} not found`
      });
    });
  });
});

describe("Scenario 2:", () => {
  describe("GET /users", () => {
    test("should return not empty array", async () => {
      await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });

      const getAllUsersResponse = await request(server).get("/api/users");
      expect(getAllUsersResponse.body.length).toBeTruthy();
    });

    test("status code should be 200", async () => {
      const getAllUsersResponse = await request(server).get("/api/users");
      expect(getAllUsersResponse.statusCode).toBe(200);
    });
  });

  describe("POST /users", () => {
    test("status code should be 201", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });

      expect(response.statusCode).toBe(201);
    });
  });

  describe("GET /users/userId", () => {
    test("status code should be 200", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const { id: userId }: IUser = response.body;

      const getUserResponse = await request(server).get(`/api/users/${userId}`);
      expect(getUserResponse.statusCode).toBe(200);
    });
  });

  describe("PUT /users/userId", () => {
    test("status code should be 200", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const { id: userId }: IUser = response.body;

      const putUserResponse = await request(server).put(`/api/users/${userId}`).send({
        name: "New User"
      });

      expect(putUserResponse.statusCode).toBe(200);
    });
  })

  describe("DELETE /users/userId", () => {
    test("status code should be 204", async () => {
      const response = await request(server).post("/api/users").send({
        name: "User",
        age: 20,
        hobbies: ["Science"]
      });
      const { id: userId }: IUser = response.body;

      const deleteUserResponse = await request(server).delete(`/api/users/${userId}`);
      expect(deleteUserResponse.statusCode).toBe(204);
    });
  });
});

describe("Scenario 3:", () => {
  describe("GET /users", () => {
    test("should return, that there is no such endpoint", async () => {

      const getAllUsersResponse = await request(server).get("/api/aaa");
      expect(getAllUsersResponse.body).toEqual({ message: "Endpoint is not found" });
    });
  });

  describe("POST /users", () => {
    test("should return a message with required fields", async () => {
      const response = await request(server).post("/api/users").send({
        age: 20,
        hobbies: ["Science"]
      });
      expect(response.body).toEqual({ message: "Name, age, hobbies are required" });
    });

    test("status code should be 400", async () => {
      const response = await request(server).post("/api/users").send({
        age: 20,
        hobbies: ["Science"]
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /users/userId", () => {
    test("should return message, that user ID is invalid", async () => {
      const getUserResponse = await request(server).get(`/api/users/someUserID`);

      expect(getUserResponse.body).toEqual({ message: "User ID is invalid" });
    });

    test("status code should be 400", async () => {
      const getUserResponse = await request(server).get(`/api/users/someUserID`);

      expect(getUserResponse.statusCode).toBe(400);
    });
  });

  describe("PUT /users/userId", () => {
    test("should return message, that user ID is invalid", async () => {
      const putUserResponse = await request(server).put(`/api/users/someUserID`).send({
        name: "New User"
      });

      expect(putUserResponse.body).toEqual({ message: "User ID is invalid" });
    });

    test("status code should be 400", async () => {
      const putUserResponse = await request(server).put(`/api/users/someUserID`).send({
        name: "New User"
      });

      expect(putUserResponse.statusCode).toBe(400);
    });
  })

  describe("DELETE /users/userId", () => {
    test("should return message, that user ID is invalid", async () => {

      const deleteUserResponse = await request(server).delete(`/api/users/someUserID`);
      expect(deleteUserResponse.body).toEqual({ message: "User ID is invalid" });
    });

    test("status code should be 400", async () => {

      const deleteUserResponse = await request(server).delete(`/api/users/someUserID`);
      expect(deleteUserResponse.statusCode).toBe(400);
    });
  });
});

afterAll((done) => {
  server.close()
  done()
})