import reportService from "../services/reportService";

const getTop10SaleProductRevenue = async (req, res) => {
  try {
    const { filterType, selectedDate, startDate, endDate } = req.query;
    // console.log("Received filterType in backend:", filterType);
    const topProducts = await reportService.getTop10ProductBySale(
      filterType,
      selectedDate,
      startDate,
      endDate
    );
    res.json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTop10SaleProductQuantity = async (req, res) => {
  try {
    const { filterType, selectedDate, startDate, endDate } = req.query;
    const topProducts = await reportService.getTop10ProductByQuantity(
      filterType,
      selectedDate,
      startDate,
      endDate
    );
    res.json(topProducts);
    // console.log("aâ", topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTop10SaleProductRevenue: getTop10SaleProductRevenue,
  getTop10SaleProductQuantity: getTop10SaleProductQuantity,
};
