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

    const existingDetails = await db.PurchaseDetail.findAll({
      where: { purchaseId: purchase.purchaseId },
      raw: true,
    });

    const detailsToUpdate = [];
    const detailsToCreate = [];
    const detailsToDelete = [];

    // Lưu trữ các productId hiện có để kiểm tra
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
      detailsToDelete.push(existingDetailMap[productId].id);
    }

    // console.log("Existing Details:", existingDetails);
    // console.log("Purchase Details:", purchaseDetails);
    // console.log("Details to Update:", detailsToUpdate);
    // console.log("Details to Create:", detailsToCreate);
    // console.log("Details to Delete:", detailsToDelete);

    for (let detail of detailsToUpdate) {
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

    for (let detail of detailsToCreate) {
      await db.PurchaseDetail.create({
        purchaseId: detail.purchaseId,
        productId: detail.productId,
        quantity: detail.quantity,
        costPrice: detail.costPrice,
        total: detail.total,
      });
    }

    for (let id of detailsToDelete) {
      await db.PurchaseDetail.destroy({
        where: { id: id },
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

module.exports = {
  createNewPurchase: createNewPurchase,
  createNewPurchaseDetail: createNewPurchaseDetail,
  getAllPurchase: getAllPurchase,
  EditPurchaseAndDetails: EditPurchaseAndDetails,
};
