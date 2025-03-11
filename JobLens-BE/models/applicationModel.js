const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, dialect: "mysql", logging: false,
});

const JobApplication = sequelize.define("JobApplication", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    cv_url: { type: DataTypes.STRING, allowNull: false },

});

sequelize.sync();
module.exports = JobApplication;
