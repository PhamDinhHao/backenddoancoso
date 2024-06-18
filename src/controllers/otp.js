import db from "../models/index";
import { Op, Sequelize } from "sequelize";
export const create_confirm_otp = async (email, otp) => {
    try {
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + 1 * 60000);

        console.log("checkemail", email);

        // Check if the email already exists in the OTP table
        const existingOtp = await db.OTP.findOne({ where: { email } });

        if (existingOtp) {
            return { message: 'Email already exists!' };
        }

        // Create a new OTP entry
        await db.OTP.create({
            email,
            otp,
            createdAt: currentTime,
            expiry_time: expiryTime
        });

        return { message: 'OTP created successfully' };
    } catch (err) {
        throw new Error(err.message || 'Server error');
    }
};

export const deleteExpiredRecordNow = async (email) => {
    try {
        await db.OTP.destroy({
            where: { email }
        });
        console.log(`Expired records deleted successfully for ${email}.`);
    } catch (error) {
        console.error('Error deleting expired records:', error);
    }
};
export const deleteExpiredRecords = async (email) => {
    const currentTime = new Date();
    try {
        await db.OTP.destroy({
            where: {
                email,
                expiry_time: {
                    [Op.lt]: currentTime
                }
            }
        });
        console.log(`Expired records deleted successfully for ${email}.`);
    } catch (error) {
        console.error('Error deleting expired records:', error);
    }
};
export const read_confirm_otp = async (email, otp) => {
    try {
        const data = await db.OTP.findOne({ where: { email } });

        if (!data) {
            return { success: false, message: 'Email does not match' };
        }

        if (data.otp === otp) {
            return { success: true, message: 'Email and OTP match found' };
        } else {
            return { success: false, message: 'Email exists but OTP does not match' };
        }
    } catch (error) {
        throw new Error('Server error');
    }
};