import { request } from "express";
import db from "../models/index";
import { Op, Sequelize } from "sequelize";
let createNewSale = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newSale = await db.Sale.create({
                saleDate: data.saleDate,
                customerId: data.customerId,
                total: data.total
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
const getStartDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.setDate(currentDate.getDate() - 7));
};
const getTotalSalesByDay = async () => {
    try {
        const startDate = getStartDate();
        const endDate = new Date();

        const totalSalesByDay = await db.Sale.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('saleDate')), 'date'],
                [Sequelize.fn('SUM', Sequelize.col('total')), 'totalSales']
            ],
            where: {
                saleDate: {
                    [Op.between]: [startDate, endDate],
                },
            },
            group: [Sequelize.fn('DATE', Sequelize.col('saleDate'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('saleDate')), 'ASC']]
        });

        const dateRange = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            dateRange.push(new Date(date));
        }


        const result = dateRange.map(date => {
            const found = totalSalesByDay.find(sale => new Date(sale.dataValues.date).toDateString() === date.toDateString());
            return {
                date: date.toISOString().slice(0, 10),
                totalSales: found ? found.dataValues.totalSales : 0
            };
        });

        return {
            errCode: 0,
            errMessage: "OK",
            data: result
        };
    } catch (error) {
        console.error("Error fetching total sales by day:", error);
        return {
            errCode: 1,
            errMessage: "Error fetching total sales by day",
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

const getTotalSalesByMonth = async () => {
    try {
        const startDate = getStartDateMon();
        const endDate = getCurrentMonth();

        const totalSalesByMonth = await db.Sale.findAll({
            attributes: [
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('saleDate'), '%Y-%m'), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total')), 'totalSales']
            ],
            where: {
                saleDate: {
                    [Op.between]: [startDate, endDate],
                },
            },
            group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('saleDate'), '%Y-%m')],
            order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('saleDate'), '%Y-%m'), 'ASC']]
        });

        // Create an array of all months within the last 12 months including current month
        const dateRange = [];
        const currentDate = new Date();
        currentDate.setDate(1); // Set to the first day of the current month to ensure correct month calculation
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            dateRange.push(date);
        }
        dateRange.reverse();

        // Fill in result array with each month's totalSales or 0 if not found
        const result = dateRange.map(date => {
            const monthString = date.toISOString().slice(0, 7); // Format as 'YYYY-MM'
            const found = totalSalesByMonth.find(sale => sale.dataValues.month === monthString);
            return {
                month: monthString,
                totalSales: found ? found.dataValues.totalSales : 0
            };
        });

        return {
            errCode: 0,
            errMessage: "OK",
            data: result
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
    createNewSale: createNewSale,
    createNewSaleDetail: createNewSaleDetail,
    getTotalSalesByDay: getTotalSalesByDay,
    getTotalSalesByMonth: getTotalSalesByMonth
};