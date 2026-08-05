const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/user/adminController');
const path = require('path');
const multer = require('multer');

// ตั้งค่า Multer สำหรับอัพโหลดไฟล์ชั่วคราว
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('อนุญาตเฉพาะไฟล์ JPG, PNG, GIF, PDF, DOC, และ DOCX เท่านั้น'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});


// =============================================
// TEST
// =============================================
router.post("/testing", adminController.testing);

// =============================================
// ADMIN
// =============================================
router.post("/register", adminController.registerAdmin);
router.get("/registration", adminController.registrationUsers);

// Optional
// router.get("/admin/:id", adminController.getAdmin);
// router.put("/admin/:id", adminController.updateAdmin);
// router.delete("/admin/:id", adminController.deleteAdmin);

// =============================================
// PURCHASE CRUD
// =============================================
router.post("/purchases", adminController.createPurchase);
router.get("/allpurchases", adminController.purchaseData);
router.get("/purchase/:id", adminController.getPurchaseById);
router.put("/purchase/:id", adminController.updatePurchase);
router.delete("/purchase/:id", adminController.deletePurchase);

// =============================================
// RECIPE CRUD
// =============================================
router.post("/createrecipe", adminController.createRecipe);
router.get("/allrecipes", adminController.getAllRecipes);
router.get("/recipe/:id", adminController.getRecipeById);
router.put("/recipe/:id", adminController.updateRecipe);
router.delete("/recipe/:id", adminController.deleteRecipe);

// =============================================
// ORDER CRUD
// =============================================
router.post("/createorder", adminController.createOrder);
router.get("/allorders", adminController.getAllOrder);
router.get("/order/:id", adminController.getOrderById);
router.put("/order/:id", adminController.updateOrder);
router.delete("/order/:id", adminController.deleteOrder);

// =============================================
// REPORT CRUD
// =============================================
router.post("/createreport", adminController.createReport);
router.get("/allreports", adminController.getAllReports);
router.get("/getreport/:id", adminController.getReportById);
router.put("/updatereport/:id", adminController.updateReport);
router.delete("/deletereport/:id", adminController.deleteReport);

// =============================================
// CUSTOMER CRUD
// =============================================
router.post("/createcustomer", adminController.createCustomer);
router.get("/allcustomers", adminController.getCustomers);
router.get("/getcustomer/:id", adminController.getCustomer);
router.put("/updatecustomer/:id", adminController.updateCustomer);
router.delete("/deletecustomer/:id", adminController.deleteCustomer);



module.exports = router;
