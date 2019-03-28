import { Request, Response } from "express";

// Renders the home page.
export default (req: Request, res: Response) => {
  res.render("home", { title: "Home" });
};
