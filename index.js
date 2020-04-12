const express = require("express");
const posts = require("./posts/post-model");
const postsRouter = require("./posts/post-router");

const server = express();
const port = 8000;

server.use(express.json());

server.get("/", (req, res) => {
  res.json({
    message: "P&C aPi",
  });
});

server.use("/posts", postsRouter);

server.listen(port, () => {
  console.log(`== Server running at ${port} ==`);
});
