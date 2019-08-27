import path from "path";

// Use these below and throughout code
export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const serverConfig = {
  port: process.env.PORT || 8280,
  imgDir: path.join(__dirname, "/public/image"),
  publicDir: path.join(__dirname, "/public")
};
export const databaseCredentials = {
  host: "localhost",
  user: "root",
  password: "ParthTrivedi@30488",
  database: "huckleberry",
  port: 3306,
  dialect: "mysql"
};
export const mailCredentials = {
  service: "Gmail",
  user: "huckleberry.vvdn@gmail.com",
  password: "huckleberry",
  success: "Mail has been sent. Please check your registered email address."
};
