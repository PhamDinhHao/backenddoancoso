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
                salePrice: data.salePrice,
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

            //tru  quantity của SaleDetail vào quantity của sản phẩm tìm được
            let newQuantity = product.quantity - data.quantity;
            if (newQuantity >= 0) {
                await db.Product.update(
                    { quantity: newQuantity },
                    { where: { id: data.productId } }
                );
                resolve({
                    errCode: 0,
                    errMessage: "Sale detail created successfully",
                    newSaleDetail: newSaleDetail.toJSON(),
                });
            }
            else {
                let sale = await db.Sale.findOne({
                    where: { id: data.saleId },
                    raw: false

                })
                if (!sale) {
                    resolve({
                        errCode: 2,
                        errMessage: `The sale isn't exist`
                    });

                }
                else {
                    await sale.destroy();

                    // await db.supplier.destroy({
                    //     where: { id: supplierId },
                    // })


                    resolve({
                        errCode: 3,
                        errMessage: `The sale is delete`
                    });
                }
            }

            // Cập nhật quantity mới trong bảng Product

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
let getAllSale = (SaleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let Sales = "";

            if (SaleId === "ALL" || !SaleId) {
                Sales = db.Sale.findAll({
                    attributes: {
                        // exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Customer,
                            as: "Customer",
                            attributes: ["id", "name"],
                        },
                    ],
                    nest: true,
                });
            } else {
                Sales = db.Sale.findOne({
                    where: { id: SaleId },
                    attributes: {
                        // exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Customer,
                            as: "Customer",
                            attributes: ["id", "name"],
                        },
                    ],
                    nest: true,
                });
            }
            resolve(Sales);
        } catch (error) {
            reject(error);
        }
    });
};

let EditSaleAndDetails = async (Sale, SaleDetails) => {
    try {
        // Cập nhật thông tin Sale
        await db.Sale.update(
            {
                customerIdId: Sale.customerIdId,
                total: Sale.total,
            },
            { where: { id: Sale.saleId } }
        );

        // Lấy danh sách các chi tiết mua hàng hiện có
        const existingDetails = await db.SaleDetail.findAll({
            where: { SaleId: Sale.saleId },
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
        for (let detail of SaleDetails) {
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

            await db.SaleDetail.update(
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

            await db.SaleDetail.create({
                saleId: detail.saleId,
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

            await db.SaleDetail.destroy({
                where: { id: detail.id },
            });
        }

        return {
            errCode: 0,
            message: "Update successful",
        };
    } catch (error) {
        console.error("Error in handleEditSaleAndDetails:", error);
        throw error;
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
    getTotalSalesByMonth: getTotalSalesByMonth,
    EditSaleAndDetails: EditSaleAndDetails,
    getAllSale: getAllSale
};