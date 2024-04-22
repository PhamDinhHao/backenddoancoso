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
        });
      }
      if (productId && productId != "ALL") {
        products = db.Product.findOne({
          where: { id: productId },
          attributes: {
            // exclude: ['password']
          },
        });
      }
      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
};

// let createNewCustomer = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await db.Customer.create({
//         name: data.name,
//         phoneNumber: data.phoneNumber,
//         address: data.address,
//         email: data.email,
//         gender: data.gender,
//         birthday: data.birthday,
//         debtCustomer: data.debtCustomer,
//       });
//       resolve({
//         errCode: 0,
//         errMessage: "oke",
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
// let deleteCustomer = (customerId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let customer = await db.Customer.findOne({
//         where: { id: customerId },
//         raw: false,
//       });
//       if (!customer) {
//         resolve({
//           errCode: 2,
//           errMessage: `The customer isn't exist`,
//         });
//       } else {
//         await customer.destroy();

//         // await db.supplier.destroy({
//         //     where: { id: supplierId },
//         // })

//         resolve({
//           errCode: 0,
//           errMessage: `The customer is delete`,
//         });
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
// let updateCustomerData = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!data.id) {
//         resolve({
//           errCode: 2,
//           errMessage: "missing requier parameter",
//         });
//       }
//       let customer = await db.Customer.findOne({
//         where: { id: data.id },
//         raw: false,
//       });

//       if (customer) {
//         customer.name = data.name;
//         customer.phoneNumber = data.phoneNumber;
//         customer.address = data.address;
//         customer.email = data.email;
//         customer.debtCustomer = data.debtCustomer;
//         customer.gender = data.gender;
//         customer.birthday = data.birthday;
//         await customer.save();

//         resolve({
//           errCode: 0,
//           errMessage: "Update the customer succeeds",
//         });
//       } else {
//         resolve({
//           errCode: 1,
//           errMessage: "customer not found",
//         });
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

module.exports = {
  getAllProducts: getAllProducts,
  //   createNewCustomer: createNewCustomer,
  //   deleteCustomer: deleteCustomer,
  //   updateCustomerData: updateCustomerData,
};
