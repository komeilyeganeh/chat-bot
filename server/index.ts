import express from "express";
import ChatRoute from "./routes/index.route";

const PORT = process.env.PORT || 3000;

// ==================== instance of express app ====================
const app = express();
app.use(express.json());

// ==================== routes ====================
app.use(ChatRoute);

// ==================== listen app on port 3000 ====================
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
