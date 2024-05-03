import app from "#services/app";
import cors from "#middlewares/cors";
import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler } from "#exception/error_handler";
import { httpLogger } from "#services/logger";
import { customRequestMethods } from "#middlewares/custom_request_methods";
import { customReponseMethods } from "#middlewares/custom_response_methods";

// register middlewares
app.use(customRequestMethods);
app.use(customReponseMethods);
// app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//register routes
await import("#start/routes");

// error handler
app.use(errorHandler);
