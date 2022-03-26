import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import { usersRoutes } from "./routes/users.routes";
import swaggerFile from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/users", usersRoutes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      if (err.message === "User not found.") {
        return response.status(404).json({
          error: err.message,
        });
      }

      if (
        err.message === "This email is already in use." ||
        err.message === "You need to be an admin to list all users."
      ) {
        return response.status(400).json({
          error: err.message,
        });
      }
    }

    return response.status(500).json({
      status: "error",
      message: "Internal Server Error!",
    });
  },
);

export { app };
