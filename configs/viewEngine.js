// View engines allow us to render web pages using template files. These templates are filled with actual data and served to the client.
import express from "express";

function configViewEngine(app) {
    app.set("view engine", "ejs");
    app.set("views", "./views");
}

export default configViewEngine;