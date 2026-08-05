const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Admin = require('../../models/user/admin');
const Member = require('../../models/user/member')
const Purchase = require("../../models/purchase");
const Recipe = require('../../models/recipe');
const Order = require('../../models/order')
const Report = require("../../models/report");
const Customer = require("../../models/customer");
const mongoose = require('mongoose');

const multer = require("multer");

const storage = multer.memoryStorage();
exports.upload = multer({ storage });

exports.testing = async (req, res) => {

  const data = req.body;
  try {
    res.status(201).json({ success: true, message: 'testing', data });
  } catch (err) {
    console.error('❌ Testing error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
}


exports.registerAdmin = async (req, res) => {
  const data = req.body;
  if (duplicateUser) {
    return res.status(409).json({ success: false, message: 'ข้อมูลซ้ำ กรุณาตรวจสอบ username, เลขบัตรประชาชน, เบอร์โทร หรืออีเมล' });
  }
  // 2. Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3. Create new admin
  const newAdmin = new Admin({
    ...data,
    password: hashedPassword,
    AdminID: uuidv4()
  });
  // 4. Save to DB
  await newAdmin.save();
  try {
    res.status(201).json({ success: true, message: 'ลงทะเบียนสำเร็จ', admin: newAdmin });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
}



exports.registrationUsers = async (req, res) => {

  try {
    // 1. Retrieve all courses from the database
    const members = await Member.find({});  // The empty object {} means "find all"

    // 2. Respond with the list of courses
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully!',
      members: members // Send back the array of course documents
    });
  } catch (err) {
    console.error('❌ Error retrieving courses:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
      error: err.message // It's a good practice to send the error message back to the client
    });
  }
}




// =====================================================
// CREATE PURCHASE
// =====================================================

exports.createPurchase = async (req, res) => {

  try {

    // Get data from Vue / Postman
    const data = req.body;


    // -----------------------------------------
    // Create Purchase
    // -----------------------------------------

    const purchase = new Purchase({

      purchaseNumber:
        data.purchaseNumber,

      purchaseDate:
        data.purchaseDate,

      expectedDeliveryDate:
        data.expectedDeliveryDate,

      actualDeliveryDate:
        data.actualDeliveryDate,

      supplierName:
        data.supplierName,

      items:
        data.items,

      paymentStatus:
        data.paymentStatus,

      paymentMethod:
        data.paymentMethod,

      amountPaid:
        data.amountPaid,

      paymentDueDate:
        data.paymentDueDate,

      subtotal:
        data.subtotal,

      total:
        data.total,

      balanceDue:
        data.balanceDue

    });


    // -----------------------------------------
    // Save to MongoDB
    // -----------------------------------------

    const savedPurchase =
      await purchase.save();


    // -----------------------------------------
    // Response
    // -----------------------------------------

    res.status(201).json({

      success: true,

      message:
        'Purchase created successfully',

      data:
        savedPurchase

    });


  } catch (err) {

    console.error(
      '❌ Create Purchase error:',
      err
    );


    res.status(500).json({

      success: false,

      message:
        'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',

      error:
        err.message

    });

  }

};

// GET ALL PURCHASES
exports.purchaseData = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ purchaseDate: -1 });

    res.status(200).json(purchases);

  } catch (error) {
    console.error("Get purchases error:", error);

    res.status(500).json({
      message: "Failed to fetch purchases",
      error: error.message
    });
  }
};

// =====================================================
// GET PURCHASE BY ID
// =====================================================

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    res.status(200).json({
      success: true,
      data: purchase
    });

  } catch (error) {
    console.error("Get purchase error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase",
      error: error.message
    });
  }
};

// =====================================================
// UPDATE PURCHASE
// =====================================================

exports.updatePurchase = async (req, res) => {
  try {

    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      data: purchase
    });

  } catch (error) {
    console.error("Update purchase error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update purchase",
      error: error.message
    });
  }
};

// =====================================================
// DELETE PURCHASE
// =====================================================

exports.deletePurchase = async (req, res) => {
  try {

    const purchase = await Purchase.findByIdAndDelete(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully"
    });

  } catch (error) {
    console.error("Delete purchase error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete purchase",
      error: error.message
    });
  }
};





// =====================================================
// CREATE NEW RECIPE
// =====================================================



// =====================================================
// CREATE RECIPE FROM PURCHASE / INVENTORY DATA
// =====================================================

exports.createRecipe = async (req, res) => {

  try {

    console.log(
      '📥 NEW RECIPE BODY:',
      JSON.stringify(req.body, null, 2)
    );


    const {
      name,
      category,
      description,
      sellingPrice,
      yield: recipeYield,
      ingredients,
      status,
      posEnabled
    } = req.body;


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!name) {

      return res.status(400).json({
        success: false,
        message: 'Recipe name is required.'
      });

    }


    if (!category) {

      return res.status(400).json({
        success: false,
        message: 'Recipe category is required.'
      });

    }


    if (
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message: 'Recipe must contain at least one ingredient.'
      });

    }


    if (
      !sellingPrice ||
      Number(sellingPrice) <= 0
    ) {

      return res.status(400).json({
        success: false,
        message: 'Selling price must be greater than 0.'
      });

    }


    // =================================================
    // GET ALL PURCHASES
    // =================================================

    const purchases = await Purchase
      .find({})
      .sort({
        purchaseDate: -1,
        createdAt: -1
      });


    if (!purchases || purchases.length === 0) {

      return res.status(400).json({
        success: false,
        message: 'No purchase inventory found.'
      });

    }


    // =================================================
    // BUILD INVENTORY PRICE MAP
    // =================================================
    //
    // Latest purchase appears first because purchases
    // are sorted by purchaseDate DESC.
    //
    // Example:
    //
    // Chicken Breast → 125/kg
    // Beef           → 350/kg
    // Garlic         → 80/kg
    //
    // =================================================

    const inventoryMap = new Map();


    for (const purchase of purchases) {

      if (!Array.isArray(purchase.items)) {
        continue;
      }


      for (const item of purchase.items) {

        const key =
          item.name
            .trim()
            .toLowerCase();


        // Only keep latest price
        if (!inventoryMap.has(key)) {

          inventoryMap.set(key, {

            inventoryId:
              item.name,

            name:
              item.name,

            unit:
              item.unit,

            unitCost:
              Number(item.unitCost)

          });

        }

      }

    }


    console.log(
      '📦 INVENTORY PRICE MAP:',
      [...inventoryMap.values()]
    );


    // =================================================
    // BUILD RECIPE INGREDIENTS
    // =================================================

    const recipeIngredients = [];


    for (const ingredient of ingredients) {

      if (!ingredient.name) {

        return res.status(400).json({

          success: false,

          message:
            'Every ingredient must have a name.'

        });

      }


      if (
        ingredient.quantity === undefined ||
        Number(ingredient.quantity) <= 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Invalid quantity for ${ingredient.name}.`

        });

      }


      const ingredientName =
        ingredient.name
          .trim()
          .toLowerCase();


      // =================================================
      // FIND INVENTORY ITEM
      // =================================================

      const inventoryItem =
        inventoryMap.get(ingredientName);


      if (!inventoryItem) {

        return res.status(400).json({

          success: false,

          message:
            `Ingredient "${ingredient.name}" was not found in purchase inventory.`

        });

      }


      // =================================================
      // QUANTITY
      // =================================================

      const quantity =
        Number(ingredient.quantity);


      // =================================================
      // COST
      // =================================================

      const unitCost =
        Number(inventoryItem.unitCost);


      const cost =
        quantity * unitCost;


      // =================================================
      // SAVE INGREDIENT
      // =================================================

      recipeIngredients.push({

        inventoryId:
          inventoryItem.inventoryId,

        name:
          inventoryItem.name,

        quantity:
          quantity,

        unit:
          ingredient.unit ||
          inventoryItem.unit,

        unitCost:
          unitCost,

        cost:
          Number(cost.toFixed(2))

      });

    }


    // =================================================
    // CALCULATE TOTAL COST
    // =================================================

    const totalCost =
      recipeIngredients.reduce(
        (sum, ingredient) => {

          return sum + ingredient.cost;

        },
        0
      );


    const roundedTotalCost =
      Number(totalCost.toFixed(2));


    // =================================================
    // YIELD
    // =================================================

    const finalYield =
      Number(recipeYield || 1);


    if (finalYield <= 0) {

      return res.status(400).json({

        success: false,

        message:
          'Recipe yield must be greater than 0.'

      });

    }


    // =================================================
    // COST PER SERVING
    // =================================================

    const costPerServing =
      roundedTotalCost /
      finalYield;


    // =================================================
    // SELLING PRICE
    // =================================================

    const finalSellingPrice =
      Number(sellingPrice);


    // =================================================
    // GROSS PROFIT
    // =================================================

    const grossProfit =
      finalSellingPrice -
      costPerServing;


    // =================================================
    // FOOD COST %
    // =================================================

    const foodCostPercentage =
      finalSellingPrice > 0
        ? (costPerServing / finalSellingPrice) * 100
        : 0;


    // =================================================
    // CREATE RECIPE
    // =================================================

    const recipe =
      new Recipe({

        name:
          name.trim(),

        category:
          category.trim(),

        description:
          description || '',


        sellingPrice:
          finalSellingPrice,


        yield:
          finalYield,


        ingredients:
          recipeIngredients,


        totalCost:
          roundedTotalCost,


        costPerServing:
          Number(
            costPerServing.toFixed(2)
          ),


        foodCostPercentage:
          Number(
            foodCostPercentage.toFixed(2)
          ),


        grossProfit:
          Number(
            grossProfit.toFixed(2)
          ),


        status:
          status || 'ACTIVE',


        posEnabled:
          posEnabled !== false

      });


    // =================================================
    // SAVE
    // =================================================

    const savedRecipe =
      await recipe.save();


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({

      success: true,

      message:
        'Recipe created successfully.',

      data:
        savedRecipe

    });


  } catch (err) {

    console.error(
      '❌ Create recipe error:',
      err
    );


    return res.status(500).json({

      success: false,

      message:
        'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',

      error:
        err.message

    });

  }

};

// =====================================================
// GET ALL RECIPES
// =====================================================

exports.getAllRecipes = async (req, res) => {

  try {

    console.log('📥 GET ALL RECIPES');


    // =================================================
    // GET RECIPES
    // =================================================

    const recipes = await Recipe
      .find({})
      .sort({
        createdAt: -1,
        name: 1
      });


    // =================================================
    // NO RECIPES
    // =================================================

    if (!recipes || recipes.length === 0) {

      return res.status(200).json({

        success: true,

        message: 'No recipes found.',

        count: 0,

        data: []

      });

    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      success: true,

      message: 'Recipes retrieved successfully.',

      count: recipes.length,

      data: recipes

    });


  } catch (err) {

    console.error(
      '❌ Get all recipes error:',
      err
    );


    return res.status(500).json({

      success: false,

      message:
        'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',

      error:
        err.message

    });

  }

};


// ======================================================
// GET RECIPE BY ID
// ======================================================

exports.getRecipeById = async (req, res) => {
  try {
    console.log("📥 GET RECIPE");

    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recipe retrieved successfully.",
      data: recipe,
    });
  } catch (err) {
    console.error("❌ Get recipe error:", err);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: err.message,
    });
  }
};

// ======================================================
// UPDATE RECIPE
// ======================================================

exports.updateRecipe = async (req, res) => {
  try {
    console.log("📝 UPDATE RECIPE");

    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found.",
      });
    }

    Object.assign(recipe, req.body);

    // Recalculate costs if ingredients changed
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      recipe.totalCost = recipe.ingredients.reduce(
        (sum, item) => sum + Number(item.cost || 0),
        0
      );

      recipe.costPerServing =
        recipe.yield > 0
          ? recipe.totalCost / recipe.yield
          : recipe.totalCost;

      recipe.grossProfit =
        Number(recipe.sellingPrice || 0) - recipe.costPerServing;

      recipe.foodCostPercentage =
        recipe.sellingPrice > 0
          ? Number(
              (
                (recipe.costPerServing / recipe.sellingPrice) *
                100
              ).toFixed(2)
            )
          : 0;
    }

    await recipe.save();

    return res.status(200).json({
      success: true,
      message: "Recipe updated successfully.",
      data: recipe,
    });
  } catch (err) {
    console.error("❌ Update recipe error:", err);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: err.message,
    });
  }
};

// ======================================================
// DELETE RECIPE
// ======================================================

exports.deleteRecipe = async (req, res) => {
  try {
    console.log("🗑 DELETE RECIPE");

    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found.",
      });
    }

    await Recipe.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Delete recipe error:", err);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: err.message,
    });
  }
};


// =====================================================
// CREATE ORDER
// =====================================================


exports.createOrder = async (req, res) => {

  try {

    console.log(
      '📥 NEW ORDER:',
      JSON.stringify(req.body, null, 2)
    );


    const {
      orderNumber,
      orderType,
      items,
      discount = 0,
      tax = 0,
      paymentMethod = 'Cash',
      cashReceived = 0
    } = req.body;


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      orderNumber === undefined ||
      orderNumber === null
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Order number is required.'

      });

    }


    if (
      !orderType ||
      ![
        'dine-in',
        'takeaway',
        'delivery'
      ].includes(orderType)
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid order type.'

      });

    }


    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Order must contain at least one item.'

      });

    }


    // =================================================
    // CHECK DUPLICATE ORDER NUMBER
    // =================================================

    const existingOrder =
      await Order.findOne({
        orderNumber
      });


    if (existingOrder) {

      return res.status(409).json({

        success: false,

        message:
          `Order ${orderNumber} already exists.`

      });

    }


    // =================================================
    // VALIDATE DISCOUNT
    // =================================================

    const finalDiscount =
      Number(discount);


    if (
      Number.isNaN(finalDiscount) ||
      finalDiscount < 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid discount.'

      });

    }


    // =================================================
    // VALIDATE TAX
    // =================================================

    const finalTax =
      Number(tax);


    if (
      Number.isNaN(finalTax) ||
      finalTax < 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid tax.'

      });

    }


    // =================================================
    // BUILD ORDER ITEMS
    // =================================================

    const orderItems = [];


    for (const item of items) {

      // -----------------------------------------------
      // Validate recipe ID
      // -----------------------------------------------

      if (
        !item.recipeId ||
        !mongoose.Types.ObjectId.isValid(
          item.recipeId
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Invalid recipeId: ${item.recipeId}`

        });

      }


      // -----------------------------------------------
      // Validate quantity
      // -----------------------------------------------

      const quantity =
        Number(item.quantity);


      if (
        Number.isNaN(quantity) ||
        quantity <= 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Invalid quantity for recipe ${item.recipeId}.`

        });

      }


      // -----------------------------------------------
      // Find Recipe
      // -----------------------------------------------

      const recipe =
        await Recipe.findById(
          item.recipeId
        );


      if (!recipe) {

        return res.status(404).json({

          success: false,

          message:
            `Recipe ${item.recipeId} not found.`

        });

      }


      // -----------------------------------------------
      // Check POS
      // -----------------------------------------------

      if (!recipe.posEnabled) {

        return res.status(400).json({

          success: false,

          message:
            `${recipe.name} is not available on POS.`

        });

      }


      // -----------------------------------------------
      // Check recipe status
      // -----------------------------------------------

      if (recipe.status !== 'ACTIVE') {

        return res.status(400).json({

          success: false,

          message:
            `${recipe.name} is not currently available.`

        });

      }


      // -----------------------------------------------
      // Use database price
      // -----------------------------------------------

      const unitPrice =
        Number(recipe.sellingPrice);


      const total =
        quantity * unitPrice;


      // -----------------------------------------------
      // Save snapshot
      // -----------------------------------------------

      orderItems.push({

        recipeId:
          recipe._id,

        name:
          recipe.name,

        quantity:
          quantity,

        unitPrice:
          Number(
            unitPrice.toFixed(2)
          ),

        total:
          Number(
            total.toFixed(2)
          )

      });

    }


    // =================================================
    // CALCULATE SUBTOTAL
    // =================================================

    const subtotal =
      orderItems.reduce(
        (sum, item) => {

          return sum + item.total;

        },
        0
      );


    const roundedSubtotal =
      Number(
        subtotal.toFixed(2)
      );


    // =================================================
    // CALCULATE TOTAL
    // =================================================

    const total =
      roundedSubtotal -
      finalDiscount +
      finalTax;


    const roundedTotal =
      Number(
        total.toFixed(2)
      );


    if (roundedTotal < 0) {

      return res.status(400).json({

        success: false,

        message:
          'Order total cannot be negative.'

      });

    }


    // =================================================
    // PAYMENT VALIDATION
    // =================================================

    const finalCashReceived =
      Number(cashReceived);


    if (
      Number.isNaN(finalCashReceived) ||
      finalCashReceived < 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid cash received amount.'

      });

    }


    // =================================================
    // CASH PAYMENT
    // =================================================

    let change = 0;


    if (paymentMethod === 'Cash') {

      if (
        finalCashReceived <
        roundedTotal
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Insufficient cash. Required ${roundedTotal}, received ${finalCashReceived}.`

        });

      }


      change =
        finalCashReceived -
        roundedTotal;

    }


    // =================================================
    // NON-CASH PAYMENT
    // =================================================

    else {

      change = 0;

    }


    // =================================================
    // CREATE ORDER
    // =================================================

    const order =
      new Order({

        orderNumber:
          Number(orderNumber),

        orderType:
          orderType,

        items:
          orderItems,

        subtotal:
          roundedSubtotal,

        discount:
          Number(
            finalDiscount.toFixed(2)
          ),

        tax:
          Number(
            finalTax.toFixed(2)
          ),

        total:
          roundedTotal,

        paymentMethod:
          paymentMethod,

        cashReceived:
          Number(
            finalCashReceived.toFixed(2)
          ),

        change:
          Number(
            change.toFixed(2)
          ),

        status:
          'COMPLETED'

      });


    // =================================================
    // SAVE
    // =================================================

    const savedOrder =
      await order.save();


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({

      success: true,

      message:
        'Order created successfully.',

      data:
        savedOrder

    });


  } catch (err) {

    console.error(
      '❌ Create order error:',
      err
    );


    // Mongo duplicate key
    if (err.code === 11000) {

      return res.status(409).json({

        success: false,

        message:
          'Order number already exists.'

      });

    }


    return res.status(500).json({

      success: false,

      message:
        'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',

      error:
        err.message

    });

  }

};

// GET ALL RECIPES
exports.getAllOrder = async (req, res) => {
  try {
    const recipes = await Order.find();

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// GET ORDER BY ID
// ======================================================

exports.getOrderById = async (req, res) => {
  try {
    console.log("📥 GET ORDER");

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully.",
      data: order,
    });
  } catch (err) {
    console.error("❌ Get order error:", err);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: err.message,
    });
  }
};

// ======================================================
// UPDATE ORDER
// ======================================================

exports.updateOrder = async (req, res) => {
  try {
    console.log("📝 UPDATE ORDER");

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    Object.assign(order, req.body);

    // ==========================
    // Recalculate totals
    // ==========================

    if (Array.isArray(order.items)) {
      order.subtotal = order.items.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      );

      order.tax = Number((order.subtotal * 0.07).toFixed(2));

      order.total =
        order.subtotal -
        Number(order.discount || 0) +
        order.tax;

      if (order.paymentMethod === "Cash") {
        order.change =
          Number(order.cashReceived || 0) - order.total;
      } else {
        order.cashReceived = 0;
        order.change = 0;
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data: order,
    });
  } catch (err) {
    console.error("❌ Update order error:", err);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: err.message,
    });
  }
};

// ======================================================
// DELETE ORDER
// ======================================================

exports.deleteOrder = async (req, res) => {
  try {
    console.log("🗑 DELETE ORDER");

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    await Order.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Delete order error:", err);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: err.message,
    });
  }
};

// CREATE REPORT
exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL REPORTS
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET REPORT BY ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE REPORT
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE REPORT
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




// CREATE CUSTOMER

exports.createCustomer = async (req, res) => {

  try {


    const count = await Customer.countDocuments();


    const customer = await Customer.create({

      customerNumber:
        `CUS-${String(count + 1).padStart(5, "0")}`,

      ...req.body

    });


    res.json({

      success: true,

      data: customer

    });


  }
  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};





// GET ALL CUSTOMERS

exports.getCustomers = async (req, res) => {

  try {

    const customers =
      await Customer.find()
        .sort({
          createdAt: -1
        });


    res.json({

      success: true,

      count: customers.length,

      data: customers

    });


  }
  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};






// GET SINGLE CUSTOMER

exports.getCustomer = async (req, res) => {

  try {


    const customer =
      await Customer.findById(
        req.params.id
      );


    res.json({

      success: true,

      data: customer

    });


  }
  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};







// UPDATE CUSTOMER

exports.updateCustomer = async (req, res) => {

  try {


    const customer =
      await Customer.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true
        }

      );


    res.json({

      success: true,

      data: customer

    });


  }
  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};







// DELETE CUSTOMER

exports.deleteCustomer = async (req, res) => {


  try {


    await Customer.findByIdAndDelete(
      req.params.id
    );


    res.json({

      success: true,

      message: "Customer deleted"

    });


  }
  catch (error) {


    res.status(500).json({

      success: false,

      message: error.message

    });


  }

};
