const User = require("./User");
const Post = require("./Post");
const Guide = require("./Guide");
const Comment = require("./Comment");
const Contact = require("./Contact");
const Tag = require("./Tag");
const PostTag = require("./PostTag");

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

Post.hasMany(PostTag, { foreignKey: "postId" });
PostTag.belongsTo(Post, { foreignKey: "postId" });

Tag.hasMany(PostTag, { foreignKey: "tagId" });
PostTag.belongsTo(Tag, { foreignKey: "tagId" });

Post.belongsToMany(Tag, { through: PostTag, foreignKey: "postId" });
Tag.belongsToMany(Post, { through: PostTag, foreignKey: "tagId" });

module.exports = { User, Post, Guide, Comment, Contact, Tag, PostTag };
