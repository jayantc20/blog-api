import tap from "tap";
import request from "supertest";
import { app, server } from "../../src/index.js";
import config from "config";

const apiKey = config.get("API_KEY");

// Hook to close the server after each test
tap.afterEach(async () => {
  server.close();
});

// POST /api/v1/posts - Create a new post
tap.test("POST /api/v1/posts - Create a new post", async (t) => {
  // Valid request
  const res = await request(app)
    .post("/api/v1/posts")
    .set('x-api-key', apiKey)
    .send({ title: "New Post", content: "Content of the new post" });

  t.equal(res.status, 201, "Status should be 201 Created");
  t.ok(res.body.id, "Response should contain post id");
  t.equal(res.body.title, "New Post", "Title should match");
  t.equal(res.body.content, "Content of the new post", "Content should match");

  // Invalid request - missing title
  const resMissingTitle = await request(app)
    .post("/api/v1/posts")
    .set('x-api-key', apiKey)
    .send({ content: "Content without title" });

  t.equal(resMissingTitle.status, 400, "Status should be 400 Bad Request");
  t.ok(resMissingTitle.body.errors.some(err => err.msg === "Title is required"), "Error should indicate title is required");

  // Invalid request - non-string title
  const resInvalidTitle = await request(app)
    .post("/api/v1/posts")
    .set('x-api-key', apiKey)
    .send({ title: 123, content: "Valid content" });

  t.equal(resInvalidTitle.status, 400, "Status should be 400 Bad Request");
  t.ok(resInvalidTitle.body.errors.some(err => err.msg === "Title must be a string"), "Error should indicate title must be a string");

  // Invalid request - missing content
  const resMissingContent = await request(app)
    .post("/api/v1/posts")
    .set('x-api-key', apiKey)
    .send({ title: "Title without content" });

  t.equal(resMissingContent.status, 400, "Status should be 400 Bad Request");
  t.ok(resMissingContent.body.errors.some(err => err.msg === "Content is required"), "Error should indicate content is required");

  t.end();
});

// PUT /api/v1/posts/:id - Update a post
tap.test("PUT /api/v1/posts/:id - Update a post", async (t) => {
  const createResponse = await request(app)
    .post("/api/v1/posts")
    .set('x-api-key', apiKey)
    .send({ title: "Post to Update", content: "Content before update" });

  const postId = createResponse.body.id;
  // Valid update
  const updateResponse = await request(app)
    .put(`/api/v1/posts/${postId}`)
    .set('x-api-key', apiKey)
    .send({ title: "Updated Title", content: "Updated Content" });

  t.equal(updateResponse.status, 200, "Status should be 200 OK");
  t.equal(updateResponse.body.title, "Updated Title", "Title should be updated");
  t.equal(updateResponse.body.content, "Updated Content", "Content should be updated");

  // Invalid request - invalid ID format
  const invalidIdRes = await request(app)
    .put("/api/v1/posts/invalidId")
    .set('x-api-key', apiKey)
    .send({ title: "Updated Title", content: "Updated Content" });

  t.equal(invalidIdRes.status, 400, "Status should be 400 Bad Request");
  t.ok(invalidIdRes.body.errors.some(err => err.msg === "Invalid post ID format"), "Error should indicate invalid ID format");

  // Invalid request - non-string title
  const invalidTitleRes = await request(app)
    .put(`/api/v1/posts/${postId}`)
    .set('x-api-key', apiKey)
    .send({ title: 123 });

  t.equal(invalidTitleRes.status, 400, "Status should be 400 Bad Request");
  t.ok(invalidTitleRes.body.errors.some(err => err.msg === "Title must be a string"), "Error should indicate title must be a string");

  // Invalid request - non-string content
  const invalidContentRes = await request(app)
    .put(`/api/v1/posts/${postId}`)
    .set('x-api-key', apiKey)
    .send({ content: 456 });

  t.equal(invalidContentRes.status, 400, "Status should be 400 Bad Request");
  t.ok(invalidContentRes.body.errors.some(err => err.msg === "Content must be a string"), "Error should indicate content must be a string");

  t.end();
});

// GET /api/v1/posts - List posts with pagination
tap.test("GET /api/v1/posts - List posts with pagination", async (t) => {
  // Ensure there is at least one post to retrieve
  await request(app)
    .post("/api/v1/posts")
    .set('x-api-key', apiKey)
    .send({ title: "Sample Post", content: "Sample content" });

  // Valid request
  const validRes = await request(app).get("/api/v1/posts?page=1&limit=10").set('x-api-key', apiKey);
  t.equal(validRes.status, 200, "Status should be 200 OK");
  t.ok(validRes.body.posts, "Response should contain posts");
  t.ok(Array.isArray(validRes.body.posts), "Response should contain posts array");

  // Invalid request - invalid page number
  const invalidPageRes = await request(app).get("/api/v1/posts?page=-1&limit=10").set('x-api-key', apiKey);
  t.equal(invalidPageRes.status, 400, "Status should be 400 Bad Request");
  t.ok(invalidPageRes.body.errors.some(err => err.msg === "Page must be a positive integer"), "Error should indicate page must be a positive integer");

  // Invalid request - invalid limit value
  const invalidLimitRes = await request(app).get("/api/v1/posts?page=1&limit=abc").set('x-api-key', apiKey);
  t.equal(invalidLimitRes.status, 400, "Status should be 400 Bad Request");
  t.ok(invalidLimitRes.body.errors.some(err => err.msg === "Limit must be a positive integer"), "Error should indicate limit must be a positive integer");

  t.end();
});

// DELETE /api/v1/posts/:id - Delete a post
tap.test("DELETE /api/v1/posts/:id - Delete a post", async (t) => {
  const createResponse = await request(app)
    .post("/api/v1/posts")
    .set('x-api-key', apiKey)
    .send({ title: "Post to Delete", content: "Content to be deleted" });

  const postId = createResponse.body.id;

  // Valid delete
  const deleteResponse = await request(app).delete(`/api/v1/posts/${postId}`).set('x-api-key', apiKey);
  t.equal(deleteResponse.status, 204, "Status should be 204 No Content");

  // Verify post deletion
  const getResponse = await request(app).get(`/api/v1/posts/${postId}`).set('x-api-key', apiKey);
  t.equal(getResponse.status, 404, "Status should be 404 Not Found after deletion");

  // Invalid request - delete non-existent post
  const invalidDeleteRes = await request(app).delete("/api/v1/posts/nonExistentId").set('x-api-key', apiKey);
  t.equal(invalidDeleteRes.status, 404, "Status should be 404 Not Found for non-existent post");

  t.end();
});
