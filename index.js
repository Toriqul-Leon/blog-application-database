const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
var cors = require("cors");
const res = require("express/lib/response");
const port = process.env.PORT || 5000;

// !Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmtuj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const blogCollection = client.db("blogUser").collection("blogs");
    const commentCollection = client.db("blogUser").collection("comments");

    // ! GET BLOGS
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    // !GET Single BLOG
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    // !POST BLOG
    app.post("/blog", async (req, res) => {
      const newBlog = req.body;
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });

    // !POST Comment
    app.post("/comment", async (req, res) => {
      const newComment = req.body;
      const result = await commentCollection.insertOne(newComment);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
