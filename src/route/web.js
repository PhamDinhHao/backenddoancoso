import express from "express";
import homeController from "../controllers/homeControlller";
import userController from "../controllers/userController";
import supplierController from "../controllers/supplierController";
import customerController from "../controllers/customerController";
import productController from "../controllers/productController";
import categoryController from "../controllers/categoryController";
import unitController from "../controllers/unitController";
import purchaseController from "../controllers/purchaseController";
import saleController from "../controllers/saleController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomepage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/hao", (req, res) => {
    return res.send("Hello World ban Hao");
  });
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);

  router.get("/api/get-all-supplier", supplierController.handleGetAllSupplier);
  router.post(
    "/api/create-new-supplier",
    supplierController.handleCreateNewSupplier
  );
  router.put("/api/edit-supplier", supplierController.handleEditSupplier);
  router.delete(
    "/api/delete-supplier",
    supplierController.handleDeleteSupplier
  );
  router.get(
    "/api/get-supplier-suggestion",
    supplierController.handleGetSupplierSuggestions
  );

  router.get("/api/get-all-customer", customerController.handleGetAllCustomer);
  router.post(
    "/api/create-new-customer",
    customerController.handleCreateNewCustomer
  );
  router.put("/api/edit-customer", customerController.handleEditCustomer);
  router.delete(
    "/api/delete-customer",
    customerController.handleDeleteCustomer
  );
  router.get('/api/get-customer-suggestion', customerController.handleGetCustomerSuggestions);

  router.get("/api/get-all-product", productController.handleGetAllProduct);
  router.post(
    "/api/create-new-product",
    productController.handleCreateNewProduct
  );

  router.get("/api/get-product-done-sale", productController.handleGetProductDoneSale);
  router.put("/api/edit-product", productController.handleEditProduct);
  router.delete("/api/delete-product", productController.handleDeleteProduct);
  router.get(
    "/api/get-product-suggestion",
    productController.handleGetProductSuggestions
  );
  router.get(
    "/api/get-product-by-purchaseid",
    productController.handleGetProductsInPurchaseDetails
  );

  router.get("/api/allcode", userController.getAllCode);

  router.get("/api/get-all-category", categoryController.handleGetAllCategory);
  router.post(
    "/api/create-new-category",
    categoryController.handleCreateNewCategory
  );

  router.post(
    "/api/create-new-purchase",
    purchaseController.handleCreateNewPurchase
  );
  router.post(
    "/api/create-new-purchase-detail",
    purchaseController.handleCreateNewPurchaseDetail
  );
  router.get("/api/get-all-purchase", purchaseController.handleGetAllPurchase);
  router.put(
    "/api/edit-purchase-and-details",
    purchaseController.handleEditPurchaseAndDetails
  );

  router.get("/api/get-all-unit", unitController.handleGetAllUnit);
  router.post("/api/create-new-unit", unitController.handleCreateNewUnit);
  router.post("/api/create-new-sale", saleController.handleCreateNewSale);
  router.post(
    "/api/create-new-sale-detail",
    saleController.handleCreateNewSaleDetail
  );
  return app.use("/", router);
};
module.exports = initWebRoutes;
