import { request } from "express";
import db from "../models/index";

let getAllUnits = (unitId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let units = '';
            if (unitId === 'ALL') {
                units = db.Unit.findAll({
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            if (unitId && unitId != 'ALL') {
                units = db.Unit.findOne({
                    where: { id: unitId },
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            resolve(units)
        } catch (error) {
            reject(error)
        }
    })
}
let createNewUnit = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Unit.create({
                unitName: data.name,

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

    getAllUnits: getAllUnits,
    createNewUnit: createNewUnit,


}