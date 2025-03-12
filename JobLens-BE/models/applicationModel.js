const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("joblens_db", "root", "Hana@0320", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

const JobApplication = sequelize.define("JobApplication", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    cv_url: { type: DataTypes.STRING, allowNull: false },

});

sequelize.sync();
module.exports = JobApplication;
