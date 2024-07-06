import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello 5555");
});

const port = 9000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
