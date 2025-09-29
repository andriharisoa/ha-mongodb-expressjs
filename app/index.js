import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB Replica Set"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model("User", UserSchema);

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(3000, () => {
  console.log("🚀 Node.js API running on port 3000");
});

