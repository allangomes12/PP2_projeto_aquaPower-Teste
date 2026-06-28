const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Consumo = sequelize.define("Consumo", {

    tipo:{
        type:DataTypes.STRING,
        allowNull:false
    },

    mes:{
        type:DataTypes.STRING,
        allowNull:false
    },

    ano:{
        type:DataTypes.INTEGER,
        allowNull:false
    },

    valor:{
        type:DataTypes.FLOAT,
        allowNull:false
    }

});

module.exports = Consumo;