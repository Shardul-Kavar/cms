import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Welcome to the CMS.");
});

router.use((req, res) => {
  console.error("Trying to", req.method, req.url);
  res.status(400).send("404 not found!");
});

export default router;
