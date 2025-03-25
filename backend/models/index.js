const User = require("./User");
const Post = require("./Post");
const Guide = require("./Guide");
const Comment = require("./Comment");

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Guide, { foreignKey: "userId" });
Guide.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

Guide.hasMany(Comment, { foreignKey: "guideId" });
Comment.belongsTo(Guide, { foreignKey: "guideId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

module.exports = { User, Post, Guide, Comment };
