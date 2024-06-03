import { request } from "express";
import db from "../models/index";

let getAllLocation = (lacationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lacations = '';
            if (lacationId === 'ALL') {
                lacations = db.Location.findAll({
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            if (lacationId && lacationId != 'ALL') {
                lacations = db.Location.findOne({
                    where: { id: lacationId },
                    attributes: {
                        // exclude: ['password']
                    }
                })
            }
            resolve(lacations)
        } catch (error) {
            reject(error)
        }
    })
}
let createNewlacation = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Location.create({
                locationName: data.locationName,
                maxWeightCapacity: data.maxWeightCapacity,



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

    getAllLocation: getAllLocation,
    createNewlacation: createNewlacation,


}