import { request } from "express";
import db from "../models/index";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'name'],
                    where: { email: email },
                    raw: true,

                });
                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `Ok`;
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong password`;
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }

            }
            else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other email`;

            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },

            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        }
    })
}
let compareUserPassword = () => {
    return new Promise((resolve, reject) => {
        try {

        } catch (error) {
            reject(error)
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId != 'ALL') {
                users = db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used, plz try another emnail'
                });
            }
            else {
                let hashPasswordFromBrypt = await hashUserPassword(data.password);

                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBrypt,
                    name: data.name,

                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,


                })
                resolve({
                    errCode: 0,
                    errMessage: 'oke'
                });
            }

        } catch (error) {
            reject(error)
        }
    })
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }



    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false

            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The User isn't exist`
                });

            }
            else {
                await user.destroy();

                // await db.User.destroy({
                //     where: { id: userId },
                // })


                resolve({
                    errCode: 0,
                    errMessage: `The User is delete`
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "missing requier parameter"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if (user) {

                user.name = data.name;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the user succeeds'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let updatePasswordUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: data.email },
                raw: false
            })
            let hashPasswordFromBrypt = await hashUserPassword(data.password);
            if (user) {

                user.password = hashPasswordFromBrypt,
                    await user.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update the user succeeds'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
// let getAllCodeService = (typeInput) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!typeInput) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Missing required parameters!'
//                 })
//             } else {
//                 let res = {};
//                 let allcode = await db.Allcode.findAll({
//                     where: { type: typeInput }
//                 });
//                 res.errCode = 0;
//                 res.data = allcode;
//                 resolve(res);
//             }

//         } catch (error) {
//             reject(error)
//         }
//     })
// }
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    updatePasswordUserData: updatePasswordUserData,
    checkUserEmail: checkUserEmail,
    // getAllCodeService: getAllCodeService,
}