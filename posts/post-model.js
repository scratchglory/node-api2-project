const knex = require("knex");
const config = require("../knexfile");
const db = knex(config.development);

function find(query = {}) {
  const { page = 1, limit = 100, sortBy = "id", sortDir = "asc" } = query;
  const offset = limit * (page - 1);

  return db("posts")
    .orderBy(sortBy, sortDir)
    .limit(limit)
    .offset(offset)
    .select();
}

function findById(id) {
  return db("posts").where({ id }).first();
}

async function add(hub) {
  const [id] = await db("posts").insert(hub);
  return findById(id);
}

function remove(id) {
  return db("posts").where({ id }).del();
}

async function update(id, changes) {
  await db("posts").where({ id }).update(changes);

  return findById(id);
}

function findPostComments(userId) {
  return db("comments as p")
    .join("posts as u", "p.user_id", "u.id")
    .where({ user_id: userId })
    .select(["p.id", "p.text", "u.title as title"]);
}

function findPostPostById(userId, id) {
  return db("comments").where({ id, user_id: userId }).first();
}

async function addPostComment(userId, post) {
  const data = { user_id: userId, ...post };
  const [id] = await db("comments").insert(data);

  return findPostPostById(userId, id);
}

module.exports = {
  find,
  findById,
  add,
  remove,
  update,
  findPostComments,
  findPostPostById,
  addPostComment,
};
