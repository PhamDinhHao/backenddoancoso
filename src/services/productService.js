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
          include: [
            {
              model: db.Supplier,
              as: 'Supplier',
              attributes: ['id', 'name']
            },
            {
              model: db.Category,
              as: 'Category',
              attributes: ['id', 'categoryName']
            },
            {
              model: db.Unit,
              as: 'Unit',
              attributes: ['id', 'unitName']
            },


          ],
          nest: true



        });
      }
      if (productId && productId != "ALL") {
        products = db.Product.findOne({
          where: { id: productId },
          attributes: {
            // exclude: ['password']
          },
          nest: true
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
        categoryId: data.selectedCategory.value,
        supplierId: data.selectedSupplier.value,
        unitId: data.selectedUnit.value,
        image: data.image,
        quantity: data.quantity,
        description: data.description,
        costPrice: data.costPrice,
        salePrice: data.salePrice
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
        product.salePrice = data.salePrice
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

module.exports = {
  getAllProducts: getAllProducts,
  createNewProduct: createNewProduct,
  updateProductData: updateProductData,
  deleteProduct: deleteProduct,
};
