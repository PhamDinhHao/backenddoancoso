import { request } from "express";
import db from "../models/index";

let getAllSuppliers = (supplierId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let suppliers = '';
            if (supplierId === 'ALL') {
                suppliers = db.Supplier.findAll({
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            if (supplierId && supplierId != 'ALL') {
                suppliers = db.Supplier.findOne({
                    where: { id: supplierId },
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            resolve(suppliers)
        } catch (error) {
            reject(error)
        }
    })
}
let createNewSupplier = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Supplier.create({
                name: data.name,
                phoneNumber: data.phoneNumber,
                address: data.address,
                email: data.email,
                debtSupplier: data.debtSupplier,


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
let deleteSupplier = (supplierId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let supplier = await db.Supplier.findOne({
                where: { id: supplierId },
                raw: false

            })
            if (!supplier) {
                resolve({
                    errCode: 2,
                    errMessage: `The supplier isn't exist`
                });

            }
            else {
                await supplier.destroy();

                // await db.supplier.destroy({
                //     where: { id: supplierId },
                // })


                resolve({
                    errCode: 0,
                    errMessage: `The supplier is delete`
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}
let updateSupplierData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "missing requier parameter"
                })
            }
            let supplier = await db.Supplier.findOne({
                where: { id: data.id },
                raw: false
            })

            if (supplier) {
                supplier.name = data.name;
                supplier.phoneNumber = data.phoneNumber;
                supplier.address = data.address;
                supplier.email = data.email;
                supplier.debtSupplier = data.debtSupplier;
                await supplier.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the supplier succeeds'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'supplier not found'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getAllSuppliers: getAllSuppliers,
    createNewSupplier: createNewSupplier,
    deleteSupplier: deleteSupplier,
    updateSupplierData: updateSupplierData,

}