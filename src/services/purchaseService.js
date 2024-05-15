import { request } from "express";
import db from "../models/index";

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
    await db.Purchase.update(
      {
        supplierId: purchase.supplierId,
        total: purchase.total,
      },
      { where: { id: purchase.purchaseId } }
    );

    for (let detail of purchaseDetails) {
      if (detail.id) {
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
      } else {
        // Nếu không có id, sản phẩm chưa tồn tại trong danh sách chi tiết mua hàng
        await db.PurchaseDetail.create({
          purchaseId: detail.purchaseId,
          productId: detail.productId,
          quantity: detail.quantity,
          costPrice: detail.costPrice,
          total: detail.total,
        });
      }
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

module.exports = {
  createNewPurchase: createNewPurchase,
  createNewPurchaseDetail: createNewPurchaseDetail,
  getAllPurchase: getAllPurchase,
  EditPurchaseAndDetails: EditPurchaseAndDetails,
};
