const knex = require("../db.config");

exports.addCustomer = async (req, res) => {
  console.log("In add customer API with body... ", req.body);
  try {
    req.body.DateOfBirth = new Date(req.body.DateOfBirth);
    console.log(
      "Dob converted now adding to database... ",
      req.body.DateOfBirth
    );
    let newCustomer = await knex("tblcustomer").insert(req.body);
    console.log("Customer added with unique id... ", newCustomer[0]);
    return res.status(200).json({ data: newCustomer, message: "success" });
  } catch (err) {
    console.log("Error in add customer API: ", err);
    return res.status(400).json({ error: err.sqlMessage });
  }
};

exports.updateCustomer = async (req, res) => {
  console.log("In updateCustomer API with body... ", req.body);
  try {
    if (!req.body || !req.body.FileNo) {
      console.log("FileNo missing returning.. ");
      return res.status(400).json({
        message: "Pass proper payload.",
        error: "Parameter file_no missing.",
      });
    }
    if (req.body.DateOfBirth) {
      req.body.DateOfBirth = new Date(req.body.DateOfBirth);
    }
    console.log("Updating customer with FileNo: ", req.body.FileNo);
    let newCustomer = await knex("tblcustomer")
      .where("FileNo", req.body.FileNo)
      .update(req.body);
    console.log(
      "Customer updated with FileNo: ",
      req.body.FileNo,
      "updatedCustomer: ",
      newCustomer
    );
    return res.status(200).json({ data: newCustomer, message: "success" });
  } catch (err) {
    console.log("Error in update customer API: ", err);
    return res.status(400).json({ error: err.sqlMessage });
  }
};

exports.search = async (req, res) => {
  console.log("In search API with query... ", req.query.value);
  try {
    let data = await knex("tblcustomer")
      .select()
      .where("FileNo", "like", "%" + req.query.value + "%")
      .orWhere("SSN", "like", "%" + req.query.value + "%")
      .orWhere("DRL", "like", "%" + req.query.value + "%");
    console.log("Search result: ", data);
    return res.status(200).json(data);
  } catch (err) {
    console.log("Error in update customer API: ", err);
    return res.status(400).json({ error: err.sqlMessage });
  }
};
