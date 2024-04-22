import productService from "../services/productService";

let handleGetAllProduct = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      products,
    });
  }
  let products = await productService.getAllProducts(id);
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    products,
  });
};

// let handleCreateNewCustomer = async (req, res) => {
//   let message = await customerService.createNewCustomer(req.body);

//   return res.status(200).json(message);
// };
// let handleDeleteCustomer = async (req, res) => {
//   if (!req.body.id) {
//     return res.status(200).json({
//       errCode: 1,
//       message: "Missing required parameters",
//       customers,
//     });
//   }
//   let message = await customerService.deleteCustomer(req.body.id);
//   return res.status(200).json(message);
// };
// let handleEditCustomer = async (req, res) => {
//   let data = req.body;
//   let message = await customerService.updateCustomerData(data);
//   return res.status(200).json(message);
// };

module.exports = {
  handleGetAllProduct: handleGetAllProduct,
  //   handleCreateNewCustomer: handleCreateNewCustomer,
  //   handleEditCustomer: handleEditCustomer,
  //   handleDeleteCustomer: handleDeleteCustomer,
};
