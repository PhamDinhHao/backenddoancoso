const db = require("../models"); // Adjust the path as necessary

let getAllStockChecks = (stockCheckId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let stockChecks = [];

      if (stockCheckId === "ALL" || !stockCheckId) {
        stockChecks = await db.StockCheck.findAll({
          attributes: { exclude: ["createdAt", "updatedAt"] },
        });
      } else {
        stockChecks = await db.StockCheck.findOne({
          where: { id: stockCheckId },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        });
      }
      resolve({
        errCode: 0,
        message: "OK",
        stockChecks,
      });
    } catch (error) {
      reject({
        errCode: 1,
        message: "Error from server",
      });
    }
  });
};

const createNewStockCheck = async (data) => {
  try {
    // Create the new stock check in the database
    const newStockCheck = await db.StockCheck.create({
      checkDate: data.checkDate,
      totalActualQuantity: data.totalActualQuantity,
      totalActualMoney: data.totalActualMoney,
      totalMoneyDifference: data.totalMoneyDifference,
      note: data.note,
    });

    // If creation is successful, return the new stock check ID
    return {
      errCode: 0,
      stockCheckId: newStockCheck.id, // Assuming 'id' is the primary key for the StockCheck model
    };
  } catch (error) {
    console.error("Error creating new stock check:", error);
    return {
      errCode: 1,
      errMessage: "Error creating new stock check",
    };
  }
};

const createNewStockCheckDetail = async (data) => {
  try {
    // Create the new stock check detail in the database
    const newStockCheckDetail = await db.StockCheckDetail.create({
      stockCheckId: data.stockCheckId,
      productId: data.productId,
      actualQuantity: data.actualQuantity,
      quantityDifference: data.quantityDifference,
      moneyDifference: data.moneyDifference,
    });

    // Update the quantity of the product
    const product = await db.Product.findOne({ where: { id: data.productId } });
    if (product) {
      product.quantity = data.actualQuantity;
      await product.save();
    }

    // If creation is successful and product quantity updated, return success response
    return {
      errCode: 0,
      message: "Stock check detail created and product quantity updated",
    };
  } catch (error) {
    console.error("Error creating new stock check detail:", error);
    return {
      errCode: 1,
      errMessage: "Error creating new stock check detail",
    };
  }
};

module.exports = {
  createNewStockCheck,
  createNewStockCheckDetail,
  getAllStockChecks,
};
