const bcrypt = require("bcrypt");

exports.encrypt = async (password) => {
  console.log("Encrypting password... ", password);
  const salt = await bcrypt.genSalt(9);
  const hash = await bcrypt.hash(password, salt);
  console.log("Password encrypted. returning hash... ", hash);
  return hash;
};

exports.compare = async (hash, password) => {
  console.log("Comparing password...");
  return await bcrypt.compare(password, hash);
};
