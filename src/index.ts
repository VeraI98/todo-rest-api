import app from "./app";

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("");
  console.log("===================================");
  console.log(`Server started successfully`);
  console.log(`http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("===================================");
});
