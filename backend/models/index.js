const User = require("./User");
const Post = require("./Post");
const Guide = require("./Guide");

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Guide, { foreignKey: "userId" });
Guide.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, Post, Guide };
