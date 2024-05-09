import { request } from "express";
import db from "../models/index";

let getAllCategorys = (categoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let categorys = '';
            if (categoryId === 'ALL') {
                categorys = db.Category.findAll({
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            if (categoryId && categoryId != 'ALL') {
                categorys = db.Category.findOne({
                    where: { id: categoryId },
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            resolve(categorys)
        } catch (error) {
            reject(error)
        }
    })
}
let createNewCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Category.create({
                categoryName: data.name,



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
module.exports = {

    getAllCategorys: getAllCategorys,
    createNewCategory: createNewCategory,


}