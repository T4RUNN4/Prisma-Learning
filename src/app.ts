import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: true,
    message: "Welcome to the API",
  });
});

app.use("/api", routes);

export default app;