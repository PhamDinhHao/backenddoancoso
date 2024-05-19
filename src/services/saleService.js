import { request } from "express";
import db from "../models/index";

let createNewSale = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newSale = await db.Sale.create({
                saleDate: data.saleDate,
                customerId: data.customerId,
            });

            let saleId = newSale.id;

            resolve({
                errCode: 0,
                errMessage: "oke",
                saleId: saleId,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let createNewSaleDetail = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            let newSaleDetail = await db.SaleDetail.create({
                productId: data.productId,
                saleId: data.saleId,
                quantity: data.quantity,

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
            let newQuantity = product.quantity - data.quantity;

            // Cập nhật quantity mới trong bảng Product
            await db.Product.update(
                { quantity: newQuantity },
                { where: { id: data.productId } }
            );
            resolve({
                errCode: 0,
                errMessage: "Sale detail created successfully",
                newSaleDetail: newSaleDetail.toJSON(),
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewSale: createNewSale,
    createNewSaleDetail: createNewSaleDetail,
};