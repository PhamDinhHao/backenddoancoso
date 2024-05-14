import { request } from "express";
import db from "../models/index";

let getAllCustomers = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customers = '';
            if (customerId === 'ALL') {
                customers = db.Customer.findAll({
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            if (customerId && customerId != 'ALL') {
                customers = db.Customer.findOne({
                    where: { id: customerId },
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            resolve(customers)
        } catch (error) {
            reject(error)
        }
    })
}
let createNewCustomer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {



            await db.Customer.create({
                name: data.name,
                phoneNumber: data.phoneNumber,
                address: data.address,
                email: data.email,
                gender: data.gender,
                birthday: data.birthday,
                debtCustomer: data.debtCustomer,


            })
            resolve({
                errCode: 0,
                errMessage: 'oke'
            });


        } catch (error) {
            reject(error)
        }
    })
}
let deleteCustomer = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = await db.Customer.findOne({
                where: { id: customerId },
                raw: false

            })
            if (!customer) {
                resolve({
                    errCode: 2,
                    errMessage: `The customer isn't exist`
                });

            }
            else {
                await customer.destroy();

                // await db.supplier.destroy({
                //     where: { id: supplierId },
                // })


                resolve({
                    errCode: 0,
                    errMessage: `The customer is delete`
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}
let updateCustomerData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "missing requier parameter"
                })
            }
            let customer = await db.Customer.findOne({
                where: { id: data.id },
                raw: false
            })

            if (customer) {
                customer.name = data.name;
                customer.phoneNumber = data.phoneNumber;
                customer.address = data.address;
                customer.email = data.email;
                customer.debtCustomer = data.debtCustomer;
                customer.gender = data.gender;
                customer.birthday = data.birthday;
                await customer.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the customer succeeds'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'customer not found'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getCustomerSuggestions = async (query) => {
    try {

        const suggestions = await db.Customer.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.like]: `%${query}%`, // Assuming 'name' is the field to search for suggestions
                },
            },
            attributes: ["id", "name"], // Include only necessary attributes
            limit: 10,
        });
        return suggestions;
    } catch (error) {
        throw error;
    }
};
module.exports = {
    getAllCustomers: getAllCustomers,
    createNewCustomer: createNewCustomer,
    deleteCustomer: deleteCustomer,
    updateCustomerData: updateCustomerData,
    getCustomerSuggestions: getCustomerSuggestions



}