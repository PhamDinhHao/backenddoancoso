import purchaseService from "../services/purchaseService";

let handleCreateNewPurchase = async (req, res) => {
  let message = await purchaseService.createNewPurchase(req.body);

  return res.status(200).json(message);
};

let handleCreateNewPurchaseDetail = async (req, res) => {
  try {
    const requestData = req.body;
    let message = await purchaseService.createNewPurchaseDetail(requestData);
    return res.status(200).json(message);
  } catch (error) {
    console.error("Error creating new purchase detail:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

let handleGetAllPurchase = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      purchases,
    });
  }
  let purchases = await purchaseService.getAllPurchase(id);
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    purchases,
  });
};

module.exports = {
  handleCreateNewPurchase: handleCreateNewPurchase,
  handleCreateNewPurchaseDetail: handleCreateNewPurchaseDetail,
  handleGetAllPurchase: handleGetAllPurchase,
};
