// must export in order for it to work!
const express = require("express");
const posts = require("../data/db");

// creates a mini express app
const router = express.Router();

router.get("/", (req, res) => {
  posts
    .find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({
        message: "ERROR getting post",
      });
    });
});

router.get("/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the post",
      });
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      message: "Missing post title, contents, created_at, or updated_at",
    });
  }

  posts
    .add(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the post",
      });
    });
});

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      message: "Missing Post Details",
    });
  }

  posts
    .update(req.params.id, req.body)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the post",
      });
    });
});

router.delete("/:id", (req, res) => {
  posts
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The post has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

router.get("/:id/comments", (req, res) => {
  posts
    .findPostComments(req.params.id)
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      res.status(500).json({
        message: "ERROR finding post comments",
      });
    });
});

// cannot have :id twice, must be unique id's
router.get("/:id/comments/:commentId", (req, res) => {
  posts
    .findCommentById(req.params.commentId)
    //   must check if exists
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).json({ message: "Comment NOT found" });
      } else {
        res.status(200).json(comments);
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "ERROR finding comment ID",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  // check value before create
  // if it doesn't exist return an error
  if (!req.body.text) {
    // must return so that rest of the code doesn't cont. executing
    return res.status(400).json({ message: "Needs Content" });
  }
  console.log(req.body);
  posts
    .insertComment(req.body)
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "ERROR creating comment" });
    });
});

// must export in order for it to work!
module.exports = router;
