import { request } from "express";
import db from "../models/index";
const { Op } = require("sequelize");
let getAllProducts = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = "";
      if (productId === "ALL") {
        products = db.Product.findAll({
          attributes: {
            // exclude: ['password']
          },
          include: [
            {
              model: db.Supplier,
              as: "Supplier",
              attributes: ["id", "name"],
            },
            {
              model: db.Category,
              as: "Category",
              attributes: ["id", "categoryName"],
            },
            {
              model: db.Unit,
              as: "Unit",
              attributes: ["id", "unitName"],
            },
            {
              model: db.Location,
              as: "Location",
              attributes: ["id", "locationName"],
            },
          ],
          nest: true,
        });
      }
      if (productId && productId != "ALL") {
        products = db.Product.findOne({
          where: { id: productId },
          attributes: {
            // exclude: ['password']
          },
          nest: true,
        });
      }
      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
};
const handleGetProductDoneSale = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const soldProducts = await db.SaleDetail.findAll({
        attributes: [
          "productId",
          [
            db.sequelize.fn("SUM", db.sequelize.col("quantity")),
            "totalQuantity",
          ],
        ],

        group: ["SaleDetail.productId"],
      });
      resolve(soldProducts);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Product.create({
        productName: data.productName,
        categoryId: data.selectedCategory.value,
        locationId: data.selectedLocation.value,
        supplierId: data.selectedSupplier.value,
        unitId: data.selectedUnit.value,
        image: data.image,
        quantity: data.quantity,
        description: data.description,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        waitTime: data.waitTime,
      });
      resolve({
        errCode: 0,
        errMessage: "oke",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findOne({
        where: { id: productId },
        raw: false,
      });
      if (!product) {
        resolve({
          errCode: 2,
          errMessage: `The product isn't exist`,
        });
      } else {
        await product.destroy();

        // await db.supplier.destroy({
        //     where: { id: supplierId },
        // })

        resolve({
          errCode: 0,
          errMessage: `The product is delete`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateProductData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "missing requier parameter",
        });
      }
      let product = await db.Product.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (product) {
        product.productName = data.productName;
        product.categoryId = data.selectedCategory.value;
        product.supplierId = data.selectedSupplier.value;
        product.unitId = data.selectedUnit.value;
        product.image = data.image;
        product.quantity = data.quantity;
        product.description = data.description;
        product.costPrice = data.costPrice;
        product.salePrice = data.salePrice;
        await product.save();

        resolve({
          errCode: 0,
          errMessage: "Update the product succeeds",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "product not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getProductSuggestions = async (query) => {
  try {
    const suggestions = await db.Product.findAll({
      where: {
        productName: {
          [db.Sequelize.Op.like]: `%${query}%`, // Assuming 'name' is the field to search for suggestions
        },
      },
      attributes: ["id", "productName", "quantity", "costPrice", "salePrice"], // Include only necessary attributes
    });
    return suggestions;
  } catch (error) {
    throw error;
  }
};

let getProductsInPurchaseDetails = async (purchaseId) => {
  try {
    // Lấy danh sách purchaseDetail dựa trên purchaseId
    let purchaseDetails = await db.PurchaseDetail.findAll({
      where: { purchaseId: purchaseId },
      attributes: ["productId", "quantity", "costPrice", "total"],
      raw: true,
    });

    if (!purchaseDetails || purchaseDetails.length === 0) {
      return {
        errCode: 2,
        errMessage: "No purchase details found",
      };
    }

    // Lấy danh sách productId từ purchaseDetails
    const productIds = purchaseDetails.map((detail) => detail.productId);

    // Lấy thông tin chi tiết của các sản phẩm từ bảng products
    let products = await db.Product.findAll({
      where: {
        id: productIds,
      },
      attributes: ["id", "productName"],
      raw: true,
    });

    // Gán costPrice từ PurchaseDetail vào mỗi đối tượng sản phẩm trong products
    products.forEach((product) => {
      const matchingDetail = purchaseDetails.find(
        (detail) => detail.productId === product.id
      );
      if (matchingDetail) {
        product.costPrice = matchingDetail.costPrice;
      }
    });

    // Kết hợp thông tin sản phẩm với purchaseDetails
    let combinedResults = purchaseDetails.map((detail) => {
      let product = products.find((product) => product.id === detail.productId);
      return {
        ...product,
        quantity: detail.quantity,
        total: detail.total,
      };
    });

    return {
      errCode: 0,
      data: combinedResults,
    };
  } catch (error) {
    console.log("Error in getProductsInPurchaseDetails:", error);
    throw error;
  }
};
let getProductsInSaleDetails = async (saleId) => {
  try {
    // Lấy danh sách purchaseDetail dựa trên purchaseId
    let saleDetails = await db.SaleDetail.findAll({
      where: { saleId: saleId },
      attributes: ["productId", "quantity", "total", "salePrice"],
      raw: true,
    });

    if (!saleDetails || saleDetails.length === 0) {
      return {
        errCode: 2,
        errMessage: "No purchase details found",
      };
    }

    // Lấy danh sách productId từ purchaseDetails
    const productIds = saleDetails.map((detail) => detail.productId);

    // Lấy thông tin chi tiết của các sản phẩm từ bảng products
    let products = await db.Product.findAll({
      where: {
        id: productIds,
      },
      attributes: ["id", "productName", "salePrice"],
      raw: true,
    });

    // Gán costPrice từ PurchaseDetail vào mỗi đối tượng sản phẩm trong products

    // Kết hợp thông tin sản phẩm với purchaseDetails
    let combinedResults = saleDetails.map((detail) => {
      let product = products.find((product) => product.id === detail.productId);
      return {
        ...product,
        quantity: detail.quantity,
        total: detail.total,
      };
    });

    return {
      errCode: 0,
      data: combinedResults,
    };
  } catch (error) {
    console.log("Error in getProductsInPurchaseDetails:", error);
    throw error;
  }
};
module.exports = {
  getAllProducts: getAllProducts,
  createNewProduct: createNewProduct,
  updateProductData: updateProductData,
  deleteProduct: deleteProduct,
  getProductSuggestions: getProductSuggestions,
  getProductsInPurchaseDetails: getProductsInPurchaseDetails,
  handleGetProductDoneSale: handleGetProductDoneSale,
  getProductsInSaleDetails: getProductsInSaleDetails,
};
