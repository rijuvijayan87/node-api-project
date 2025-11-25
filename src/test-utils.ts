import request from "supertest";
import app from "./index";

const API_BASE_URL = process.env.API_BASE_URL;

const requester = API_BASE_URL ? request(API_BASE_URL) : request(app);

const logAndRequest = (method: "get" | "post" | "put" | "delete" | "options", path: string) => {
  const fullUrl = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  console.log(`Making ${method.toUpperCase()} request to: ${fullUrl}`);
  return (requester as any)[method](path);
};

export default logAndRequest;
