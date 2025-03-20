const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method")); // ✅ Allows PUT & DELETE in forms

let posts = []; // Store posts in memory

// 🏠 Home Route - Show all posts
app.get("/", (req, res) => {
    res.render("home", { posts });
});

// ➕ New Post Form Page
app.get("/new", (req, res) => {
    res.render("new");
});

// ✅ Handle New Post Submission
app.post("/new", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send("Title and content are required!");
    }

    const newPost = { id: posts.length, title, content };
    posts.push(newPost);
    res.redirect("/");
});

// 🔍 View Single Post
app.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).send("Post not found!");
    }

    res.render("post", { post });
});

// ✏️ Edit Post Form Page
app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).send("Post not found!");
    }

    res.render("edit", { post });
});

// ✅ Handle Post Update
app.put("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).send("Post not found!");
    }

    post.title = req.body.title;
    post.content = req.body.content;

    res.redirect("/");
});

// ❌ Handle Post Deletion
app.delete("/delete/:id", (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect("/");
});

// 🌍 Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
