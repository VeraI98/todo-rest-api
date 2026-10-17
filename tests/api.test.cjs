const { test } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../dist/app").default;

test("Todo API regression scenarios", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request(method, path, body) {
    const response = await fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return {
      status: response.status,
      data: response.status === 204 ? null : await response.json(),
    };
  }
  let id;
  await t.test("health and unknown routes", async () => {
    assert.equal((await request("GET", "/api/health")).status, 200);
    assert.equal((await request("GET", "/unknown")).status, 404);
  });
  await t.test("create trims text and supplies defaults", async () => {
    const result = await request("POST", "/api/todos", {
      text: "  Learn TypeScript  ",
    });
    assert.equal(result.status, 201);
    id = result.data.data.id;
    assert.equal(result.data.data.text, "Learn TypeScript");
    assert.equal(result.data.data.completed, false);
    assert.equal(result.data.data.priority, "medium");
  });
  await t.test("create rejects invalid text and unknown fields", async () => {
    for (const body of [
      {},
      { text: 123 },
      { text: " " },
      { text: null },
      { text: "x", extra: 1 },
      { text: "x".repeat(1001) },
    ]) {
      assert.equal((await request("POST", "/api/todos", body)).status, 400);
    }
  });
  await t.test("PATCH rejects strings masquerading as booleans", async () => {
    for (const value of ["false", "true", 0, 1, null])
      assert.equal(
        (await request("PATCH", `/api/todos/${id}`, { completed: value }))
          .status,
        400,
      );
    assert.equal(
      (await request("GET", `/api/todos/${id}`)).data.data.completed,
      false,
    );
  });
  await t.test("PATCH rejects empty or unsupported changes", async () => {
    for (const body of [{}, { unknown: 1 }, []])
      assert.equal(
        (await request("PATCH", `/api/todos/${id}`, body)).status,
        400,
      );
  });
  await t.test(
    "PATCH changes one field and preserves other fields",
    async () => {
      const result = await request("PATCH", `/api/todos/${id}`, {
        completed: true,
      });
      assert.equal(result.status, 200);
      assert.equal(result.data.data.completed, true);
      assert.equal(result.data.data.text, "Learn TypeScript");
    },
  );
  await t.test("PUT requires a complete replacement", async () => {
    assert.equal((await request("PUT", `/api/todos/${id}`, {})).status, 400);
    assert.equal(
      (await request("PUT", `/api/todos/${id}`, { text: "x" })).status,
      400,
    );
    const result = await request("PUT", `/api/todos/${id}`, {
      text: "Replaced",
      completed: false,
      priority: "high",
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.data.priority, "high");
  });
  await t.test("filters and statistics agree", async () => {
    const list = await request(
      "GET",
      "/api/todos?completed=false&priority=high&search=REPLACED",
    );
    assert.equal(list.data.meta.total, 1);
    assert.equal(
      (await request("GET", "/api/todos/stats")).data.data.completed,
      0,
    );
  });
  await t.test(
    "query validation rejects ambiguous booleans and excessive limits",
    async () => {
      for (const query of [
        "completed=1",
        "completed=0",
        "completed=true&completed=false",
        "limit=101",
        "page=0",
        "search[x]=y",
      ]) {
        assert.equal((await request("GET", `/api/todos?${query}`)).status, 400);
      }
    },
  );
  await t.test(
    "pagination returns metadata and out-of-range empty results",
    async () => {
      await request("POST", "/api/todos", { text: "Second" });
      const result = await request("GET", "/api/todos?page=2&limit=1");
      assert.equal(result.data.data.length, 1);
      assert.equal(result.data.meta.totalPages, 2);
      assert.equal(
        (await request("GET", "/api/todos?page=10")).data.data.length,
        0,
      );
    },
  );
  await t.test(
    "invalid IDs and missing todos have distinct status codes",
    async () => {
      assert.equal((await request("GET", "/api/todos/abc")).status, 400);
      assert.equal((await request("GET", "/api/todos/99999")).status, 404);
    },
  );
  await t.test("malformed JSON returns 400", async () => {
    const response = await fetch(base + "/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{broken",
    });
    assert.equal(response.status, 400);
  });
  await t.test("delete returns 204 and removes the todo", async () => {
    const result = await request("DELETE", `/api/todos/${id}`);
    assert.equal(result.status, 204);
    assert.equal(result.data, null);
    assert.equal((await request("GET", `/api/todos/${id}`)).status, 404);
  });
});
