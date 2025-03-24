const bcrypt = require("bcrypt");
bcrypt.hash("superadminpassword", 10).then((hash) => console.log(hash));
