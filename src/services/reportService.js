import db from "../models/index";
import { Sequelize, Op } from "sequelize";
import moment from "moment";

const getTop10ProductBySale = async (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  try {
    console.log("Received filterType:", filterType);

    // Ensure selectedDate is properly formatted
    selectedDate = moment(selectedDate).toISOString();

    // Determine the start and end date based on filterType and selectedDate
    if (filterType !== "custom") {
      startDate = moment(selectedDate).startOf(filterType).toISOString();
      endDate = moment(selectedDate).endOf(filterType).toISOString();
    } else {
      startDate = moment(startDate).toISOString();
      endDate = moment(endDate).toISOString();
    }

    console.log("Calculated startDate:", startDate);
    console.log("Calculated endDate:", endDate);

    const result = await db.SaleDetail.findAll({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("total")), "totalRevenue"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["productId"],
      order: [[Sequelize.literal("totalRevenue"), "DESC"]],
      limit: 10,
      include: [
        {
          model: db.Product,
          attributes: ["productName"],
        },
      ],
    });
    return result;
  } catch (error) {
    console.error("Error fetching top products by sale:", error);
    throw error;
  }
};

const getTop10ProductByQuantity = async (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  try {
    console.log("Received filterType:", filterType);

    // Ensure selectedDate is properly formatted
    selectedDate = moment(selectedDate).toISOString();

    if (filterType !== "custom") {
      startDate = moment(selectedDate).startOf(filterType).toISOString();
      endDate = moment(selectedDate).endOf(filterType).toISOString();
    } else {
      startDate = moment(startDate).toISOString();
      endDate = moment(endDate).toISOString();
    }

    console.log("Calculated startDate:", startDate);
    console.log("Calculated endDate:", endDate);

    const result = await db.SaleDetail.findAll({
      attributes: [
        "productId",
        [
          Sequelize.fn("SUM", Sequelize.col("SaleDetail.quantity")),
          "totalQuantity",
        ],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["productId"],
      order: [[Sequelize.literal("totalQuantity"), "DESC"]],
      limit: 10,
      include: [
        {
          model: db.Product,
          attributes: ["productName"],
        },
      ],
    });
    return result;
  } catch (error) {
    console.error("Error fetching top products by quantity:", error);
    throw error;
  }
};

module.exports = {
  getTop10ProductBySale,
  getTop10ProductByQuantity,
};
