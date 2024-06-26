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

const getTop10CustomersByRevenue = async (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  try {
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

    const result = await db.SaleDetail.findAll({
      attributes: [
        [
          Sequelize.fn("SUM", Sequelize.col("SaleDetail.total")),
          "totalRevenue",
        ],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: db.Sale,
          attributes: ["customerId"],
          required: true, // Ensure only Sales with a customerId are included
          include: [
            {
              model: db.Customer,
              attributes: ["name"],
              required: true, // Ensure only Sales with a Customer are included
            },
          ],
        },
      ],
      group: ["Sale.customerId", "Sale.Customer.name"],
      order: [[Sequelize.literal("totalRevenue"), "DESC"]],
      limit: 10,
    });

    return result.map((saleDetail) => {
      const customer = saleDetail.Sale.Customer;
      return {
        customerId: saleDetail.Sale.customerId,
        customerName: customer ? customer.name : "Unknown",
        totalRevenue: saleDetail.dataValues.totalRevenue,
      };
    });
  } catch (error) {
    console.error("Error fetching top customers by revenue:", error);
    throw error;
  }
};

const getTop10SuppliersByRevenue = async (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  try {
    selectedDate = moment(selectedDate).toISOString();

    if (filterType !== "custom") {
      startDate = moment(selectedDate).startOf(filterType).toISOString();
      endDate = moment(selectedDate).endOf(filterType).toISOString();
    } else {
      startDate = moment(startDate).toISOString();
      endDate = moment(endDate).toISOString();
    }

    const result = await db.Purchase.findAll({
      attributes: [
        "supplierId",
        [db.Sequelize.fn("SUM", db.Sequelize.col("total")), "totalRevenue"],
      ],
      where: {
        purchaseDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["supplierId"],
      order: [[db.Sequelize.literal("totalRevenue"), "DESC"]],
      limit: 10,
      include: [
        {
          model: db.Supplier,
          as: "Supplier",
          attributes: ["name"],
          required: true, // Ensure only Purchases with a Supplier are included
        },
      ],
    });

    return result.map((purchase) => ({
      supplierId: purchase.supplierId,
      supplierName: purchase.Supplier ? purchase.Supplier.name : "Unknown",
      totalQuantity: purchase.dataValues.totalRevenue,
    }));
  } catch (error) {
    console.error("Error fetching top suppliers by revenue:", error);
    throw error;
  }
};

module.exports = {
  getTop10ProductBySale,
  getTop10ProductByQuantity,
  getTop10CustomersByRevenue,
  getTop10SuppliersByRevenue,
};
