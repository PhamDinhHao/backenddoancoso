import { request } from "express";
import db from "../models/index";

let getAllProducts = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = "";
      if (productId === "ALL") {
        products = db.Product.findAll({
          attributes: {
            // exclude: ['password']
          },

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

let createNewProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Product.create({
        productName: data.productName,
        category: data.category,
        cost: data.cost,
        sale: data.sale,
        image: data.image,
        quantity: data.quantity,
        description: data.description,
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
        product.category = data.category;
        product.cost = data.cost;
        product.sale = data.sale;
        product.image = data.image;
        product.quantity = data.quantity;
        product.description = data.description;
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
    console.log("Query value in service:", query);
    const suggestions = await db.Product.findAll({
      where: {
        productName: {
          [db.Sequelize.Op.like]: `%${query}%`, // Assuming 'name' is the field to search for suggestions
        },
      },
      attributes: ["id", "productName"], // Include only necessary attributes
    });
    return suggestions;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProducts: getAllProducts,
  createNewProduct: createNewProduct,
  updateProductData: updateProductData,
  deleteProduct: deleteProduct,
  getProductSuggestions: getProductSuggestions,
};
