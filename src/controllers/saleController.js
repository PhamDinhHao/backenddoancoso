import saleService from "../services/saleService";

let handleCreateNewSale = async (req, res) => {
    let message = await saleService.createNewSale(req.body);

    return res.status(200).json(message);
};

let handleCreateNewSaleDetail = async (req, res) => {
    try {
        const requestData = req.body;
        let message = await saleService.createNewSaleDetail(requestData);
        return res.status(200).json(message);
    } catch (error) {
        console.error("Error creating new sale detail:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
let getTotalSalesByDay = async (req, res) => {
    try {
        const result = await saleService.getTotalSalesByDay();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error",
        });
    }
};

let getTotalSalesByMonth = async (req, res) => {
    try {
        const result = await saleService.getTotalSalesByMonth();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error",
        });
    }
};
module.exports = {
    handleCreateNewSale: handleCreateNewSale,
    handleCreateNewSaleDetail: handleCreateNewSaleDetail,
    getTotalSalesByDay: getTotalSalesByDay,
    getTotalSalesByMonth: getTotalSalesByMonth
};
