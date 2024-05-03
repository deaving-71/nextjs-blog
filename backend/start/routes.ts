import express from "express";
import app from "#services/app";
import multer from "multer";
import { authenticate } from "#middlewares/authenticate";
import * as SignupController from "#controllers/signup_controller";
import * as SigninController from "#controllers/signin_controller";
import * as BlogsController from "#controllers/blogs_controller";
import * as BlogsAdminController from "#controllers/admin/blogs_controller";
import * as TagsController from "#controllers/tags_controller";
import * as TagsAdminController from "#controllers/admin/tags_controller";
import * as AnalyticsController from "#controllers/admin/analytics_controller";

const upload = multer();

const Router = express.Router;

const v1 = Router();
const admin = Router();

const blogsAdmin = Router();
const tagsAdmin = Router();
const analytics = Router();

const users = Router();
const auth = Router();
const blogs = Router();
const tags = Router();

/**
 * ----------------------------------------------------------------
 * Public Routes
 * ----------------------------------------------------------------
 */

auth.get("/", SigninController.show);
auth.post("/sign-up", SignupController.create);
auth.post("/sign-in", SigninController.create);
auth.delete("/sign-out", authenticate, SigninController.destroy);

blogs.get("/", BlogsController.index);
blogs.get("/:slug", BlogsController.show);

tags.get("/", TagsController.index);

/**
 * ----------------------------------------------------------------
 * Admin Routes
 * ----------------------------------------------------------------
 */

blogsAdmin.get("/", BlogsAdminController.index);
blogsAdmin.get("/:id", BlogsAdminController.show);
blogsAdmin.post("/", upload.single("thumbnail"), BlogsAdminController.create);
blogsAdmin.put("/:id", upload.single("thumbnail"), BlogsAdminController.update);
blogsAdmin.delete("/:id", BlogsAdminController.destroy);

tagsAdmin.get("/:id", TagsAdminController.show);
tagsAdmin.post("/", TagsAdminController.create);
tagsAdmin.put("/:id", TagsAdminController.update);
tagsAdmin.delete("/:id", TagsAdminController.destroy);

analytics.get("/", AnalyticsController.index);

admin.use(authenticate);
admin.use("/blogs", blogsAdmin);
admin.use("/tags", tagsAdmin);
admin.use("/analytics", analytics);

v1.use("/admin", admin);
v1.use("/auth", auth);
v1.use("/users", users);
v1.use("/blogs", blogs);
v1.use("/tags", tags);

app.use("/v1", v1);

app.all("*", (req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.path}`);
});
