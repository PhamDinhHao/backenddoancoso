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

module.exports = {
  createNewPurchase: createNewPurchase,
  createNewPurchaseDetail: createNewPurchaseDetail,
  getAllPurchase: getAllPurchase,
};
