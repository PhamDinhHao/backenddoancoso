import { request } from "express";
import db from "../models/index";
import { where } from "sequelize";
import { Op, Sequelize } from "sequelize";

let createNewPurchase = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newPurchase = await db.Purchase.create({
        purchaseDate: data.purchaseDate,
        supplierId: data.supplierId,
        total: data.total,
      });

      let purchaseId = newPurchase.id;

      resolve({
        errCode: 0,
        errMessage: "oke",
        purchaseId: purchaseId,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let createNewPurchaseDetail = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newPurchaseDetail = await db.PurchaseDetail.create({
        productId: data.productId,
        purchaseId: data.purchaseId,
        quantity: data.quantity,
        costPrice: data.costPrice,
        total: data.total,
      });

      let product = await db.Product.findOne({
        where: { id: data.productId },
        attributes: ["quantity"],
      });

      if (!product) {
        return resolve({
          errCode: 1,
          errMessage: "Product not found",
        });
      }

      // Cộng quantity của PurchaseDetail vào quantity của sản phẩm tìm được
      let newQuantity = product.quantity + data.quantity;

      // Cập nhật quantity mới trong bảng Product
      await db.Product.update(
        { quantity: newQuantity },
        { where: { id: data.productId } }
      );

      resolve({
        errCode: 0,
        errMessage: "Purchase detail created successfully",
        purchaseDetail: newPurchaseDetail.toJSON(),
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getAllPurchase = (purchaseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let purchases = "";

      if (purchaseId === "ALL" || !purchaseId) {
        purchases = db.Purchase.findAll({
          attributes: {
            // exclude: ['password']
          },
          include: [
            {
              model: db.Supplier,
              as: "Supplier",
              attributes: ["id", "name"],
            },
          ],
          nest: true,
        });
      } else {
        purchases = db.Purchase.findOne({
          where: { id: purchaseId },
          attributes: {
            // exclude: ['password']
          },
          include: [
            {
              model: db.Supplier,
              as: "Supplier",
              attributes: ["id", "name"],
            },
          ],
          nest: true,
        });
      }
      resolve(purchases);
    } catch (error) {
      reject(error);
    }
  });
};

let EditPurchaseAndDetails = async (purchase, purchaseDetails) => {
  try {
    // Cập nhật thông tin purchase
    await db.Purchase.update(
      {
        supplierId: purchase.supplierId,
        total: purchase.total,
      },
      { where: { id: purchase.purchaseId } }
    );

    // Lấy danh sách các chi tiết mua hàng hiện có
    const existingDetails = await db.PurchaseDetail.findAll({
      where: { purchaseId: purchase.purchaseId },
      raw: true,
    });

    const detailsToUpdate = [];
    const detailsToCreate = [];
    const detailsToDelete = [];

    // Lưu trữ các chi tiết hiện có để kiểm tra
    const existingDetailMap = existingDetails.reduce((map, detail) => {
      map[detail.productId] = detail;
      return map;
    }, {});

    // Phân loại các chi tiết sản phẩm để cập nhật hoặc thêm mới
    for (let detail of purchaseDetails) {
      if (existingDetailMap[detail.productId]) {
        // Chi tiết đã tồn tại, cần cập nhật
        detailsToUpdate.push({
          ...detail,
          id: existingDetailMap[detail.productId].id, // Lấy id từ existingDetailMap
          oldQuantity: existingDetailMap[detail.productId].quantity, // Lưu lại quantity cũ để biết tăng hay giảm
        });
        // Xóa chi tiết này khỏi existingDetailMap để xác định những chi tiết còn lại để xóa
        delete existingDetailMap[detail.productId];
      } else {
        // Chi tiết mới, cần thêm mới
        detailsToCreate.push(detail);
      }
    }

    // Các chi tiết còn lại trong existingDetailMap là những chi tiết cần xóa
    for (let productId in existingDetailMap) {
      detailsToDelete.push(existingDetailMap[productId]);
    }

    // Cập nhật các chi tiết mua hàng hiện có
    for (let detail of detailsToUpdate) {
      let product = await db.Product.findOne({
        where: { id: detail.productId },
      });
      if (product) {
        let quantityDiff = detail.quantity - detail.oldQuantity;
        let newQuantity = product.quantity + quantityDiff;
        await db.Product.update(
          { quantity: newQuantity },
          { where: { id: detail.productId } }
        );
      }

      await db.PurchaseDetail.update(
        {
          quantity: detail.quantity,
          costPrice: detail.costPrice,
          total: detail.total,
        },
        {
          where: { id: detail.id },
        }
      );
    }

    // Thêm các chi tiết mua hàng mới
    for (let detail of detailsToCreate) {
      let product = await db.Product.findOne({
        where: { id: detail.productId },
      });
      if (product) {
        let newQuantity = product.quantity + detail.quantity;
        await db.Product.update(
          { quantity: newQuantity },
          { where: { id: detail.productId } }
        );
      }

      await db.PurchaseDetail.create({
        purchaseId: detail.purchaseId,
        productId: detail.productId,
        quantity: detail.quantity,
        costPrice: detail.costPrice,
        total: detail.total,
      });
    }

    // Xóa các chi tiết mua hàng
    for (let detail of detailsToDelete) {
      let product = await db.Product.findOne({
        where: { id: detail.productId },
      });
      if (product) {
        let newQuantity = product.quantity - detail.quantity;
        await db.Product.update(
          { quantity: newQuantity },
          { where: { id: detail.productId } }
        );
      }

      await db.PurchaseDetail.destroy({
        where: { id: detail.id },
      });
    }

    return {
      errCode: 0,
      message: "Update successful",
    };
  } catch (error) {
    console.error("Error in handleEditPurchaseAndDetails:", error);
    throw error;
  }
};

const getStartDate = () => {
  const currentDate = new Date();
  return new Date(currentDate.setDate(currentDate.getDate() - 7));
};

const getTotalPurchasesByDay = async () => {
  try {
    const startDate = getStartDate();
    const endDate = new Date();

    const totalPurchasesByDay = await db.Purchase.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("purchaseDate")), "date"],
        [Sequelize.fn("SUM", Sequelize.col("total")), "totalPurchase"],
      ],
      where: {
        purchaseDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [Sequelize.fn("DATE", Sequelize.col("purchaseDate"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("purchaseDate")), "ASC"]],
    });
    const dateRange = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dateRange.push(new Date(date));
    }
    const result = dateRange.map((date) => {
      const found = totalPurchasesByDay.find(
        (purchase) =>
          new Date(purchase.dataValues.date).toDateString() ===
          date.toDateString()
      );
      return {
        date: date.toISOString().slice(0, 10),
        totalPurchases: found ? found.dataValues.totalPurchase : 0,
      };
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching total purchases by day:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching total purchases by day",
    };
  }
};
const getCurrentMonth = () => {
  const currentDate = new Date();
  return new Date(currentDate.setMonth(currentDate.getMonth() + 2)); // Trả về tháng hiện tại, bắt đầu từ 1 (tháng 1) đến 12 (tháng 12)
};
const getStartDateMon = () => {
  const currentDate = new Date();
  return new Date(currentDate.setMonth(currentDate.getMonth() - 10));
};

const getTotalPurchasesByMonth = async () => {
  try {
    const startDate = getStartDateMon();
    const endDate = getCurrentMonth();

    const totalSalesByMonth = await db.Purchase.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("purchaseDate"), "%Y-%m"),
          "month",
        ],
        [Sequelize.fn("SUM", Sequelize.col("total")), "totalPurchase"],
      ],
      where: {
        purchaseDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [
        Sequelize.fn("DATE_FORMAT", Sequelize.col("purchaseDate"), "%Y-%m"),
      ],
      order: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("purchaseDate"), "%Y-%m"),
          "ASC",
        ],
      ],
    });

    // Create an array of all months within the last 12 months including current month
    const dateRange = [];
    const currentDate = new Date();
    currentDate.setDate(1); // Set to the first day of the current month to ensure correct month calculation
    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      dateRange.push(date);
    }
    dateRange.reverse();

    // Fill in result array with each month's totalSales or 0 if not found
    const result = dateRange.map((date) => {
      const monthString = date.toISOString().slice(0, 7); // Format as 'YYYY-MM'
      const found = totalSalesByMonth.find(
        (sale) => sale.dataValues.month === monthString
      );
      return {
        month: monthString,
        totalSales: found ? found.dataValues.totalSales : 0,
      };
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching total sales by month:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching total sales by month",
    };
  }
};
module.exports = {
  createNewPurchase: createNewPurchase,
  createNewPurchaseDetail: createNewPurchaseDetail,
  getAllPurchase: getAllPurchase,
  EditPurchaseAndDetails: EditPurchaseAndDetails,
  getTotalPurchasesByDay: getTotalPurchasesByDay,
  getTotalPurchasesByMonth: getTotalPurchasesByMonth,
};
