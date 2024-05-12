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