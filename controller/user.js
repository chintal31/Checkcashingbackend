const knex = require("../db.config");
var userServices = require("../services/user");

exports.signup = async (req, res) => {
  console.log("In signup API with data... ", req.body);
  try {
    console.log("Checking if username already taken...");
    if (!req.body.Username) {
      console.log("Username not passed...returning...");
      return res
        .status(400)
        .json({ error: "Pass proper payload.Username required." });
    }
    if (!req.body.password) {
      console.log("Password not passed...returning...");
      return res
        .status(400)
        .json({ error: "Pass proper payload.Password required." });
    }
    if (!req.body.Firstname || !req.body.Lastname) {
      console.log("Incomplete name passed...returning...");
      return res
        .status(400)
        .json({ error: "Pass proper payload.Incomplete name." });
    }
    let existingUser = await knex("login")
      .select()
      .where("Username", "like", "%" + req.body.Username + "%");
    console.log("Existinguser: ", existingUser);
    if (existingUser && existingUser.length > 0) {
      console.log("Username already taken...returning...");
      return res.status(400).json({ error: "Username already exists." });
    }
    console.log("Username doesn't exists. Creating new user...");
    req.body.password = await userServices.encrypt(req.body.password);
    let newUser = await knex("login").insert(req.body);
    console.log("User added with unique id... ", newUser[0]);
    let newUserDetails = {
      Username: req.body.Username,
      Firstname: req.body.Firstname,
      Lastname: req.body.Lastname,
    };
    return res.status(200).json(newUserDetails);
  } catch (err) {
    console.log("Error in signup API: ", err);
    return res.status(400).json({ error: err.sqlMessage });
  }
};

exports.login = async (req, res) => {
  console.log("In login API with data... ", req.body);
  try {
    if (!req.body.Username) {
      console.log("Username not passed...returning...");
      return res
        .status(400)
        .json({ error: "Pass proper payload.Username required." });
    }
    if (!req.body.password) {
      console.log("Password not passed...returning...");
      return res
        .status(400)
        .json({ error: "Pass proper payload.Password required." });
    }
    console.log("Checking if username exists or not...");
    //Modify api search for exact match
    let existingUser = await knex("login")
      .select()
      .where("Username", req.body.Username);
    console.log("Existinguser: ", existingUser);
    if (existingUser && existingUser.length > 0) {
      console.log("User exists with given Username. Now compare password...");
      let hash = existingUser[0].password;
      let isSame = await userServices.compare(hash, req.body.password);
      if (isSame) {
        console.log("Password matches. Login successfull ...");
        let userDetails = {
          Username: existingUser[0].Username,
          Firstname: existingUser[0].Firstname,
          Lastname: existingUser[0].Lastname,
        };
        return res.status(200).json(userDetails);
      } else {
        console.log("Password dont match. Incorrect password ...");
        return res.status(400).json({ error: "Incorrect password." });
      }
    } else {
      console.log("No user found with given username...returning...");
      return res
        .status(400)
        .json({ error: "No user found with given username." });
    }
  } catch (err) {
    console.log("Error in login API: ", err);
    return res.status(400).json({ error: err.sqlMessage });
  }
};
