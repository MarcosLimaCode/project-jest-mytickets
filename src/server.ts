import dotenv from "dotenv";
import app from "../src/index";

dotenv.config();

const port = +process.env.PORT || 5000;
app.listen(port, () => console.log("Server is up and running on port " + port));
