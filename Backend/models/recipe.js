// models/Recipe.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// =====================================================
// RECIPE INGREDIENT SCHEMA
// =====================================================

const RecipeIngredientSchema = new Schema(
  {
    // Reference to inventory item
    // This can later be replaced with an Inventory _id
    inventoryId: {
      type: String,
      required: true,
      trim: true
    },


    // Ingredient name snapshot
    name: {
      type: String,
      required: true,
      trim: true
    },


    // Quantity consumed for ONE recipe
    quantity: {
      type: Number,
      required: true,
      min: 0
    },


    // kg, g, liter, ml, pcs, etc.
    unit: {
      type: String,
      required: true,
      trim: true
    },


    // Cost of one unit at recipe creation
    unitCost: {
      type: Number,
      required: true,
      min: 0
    },


    // quantity × unitCost
    cost: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: true
  }
);


// =====================================================
// RECIPE SCHEMA
// =====================================================

const RecipeSchema = new Schema(
  {
    // =================================================
    // MENU / POS INFORMATION
    // =================================================

    name: {
      type: String,
      required: true,
      trim: true
    },


    category: {
      type: String,
      required: true,
      trim: true,
      default: 'Main Dish'
    },


    description: {
      type: String,
      trim: true,
      default: ''
    },


    // =================================================
    // RECIPE YIELD
    // =================================================

    // How many servings this recipe produces
    yield: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },


    // =================================================
    // INGREDIENTS
    // =================================================

    ingredients: {
      type: [RecipeIngredientSchema],
      required: true,

      validate: {
        validator: function (ingredients) {
          return ingredients.length > 0;
        },

        message:
          'Recipe must contain at least one ingredient.'
      }
    },


    // =================================================
    // COST
    // =================================================

    // Total cost of all ingredients
    totalCost: {
      type: Number,
      required: true,
      min: 0
    },


    // Total cost divided by yield
    costPerServing: {
      type: Number,
      required: true,
      min: 0
    },


    // =================================================
    // SELLING PRICE
    // =================================================

    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },


    // =================================================
    // PROFIT
    // =================================================

    grossProfit: {
      type: Number,
      required: true,
      min: 0
    },


    // Percentage of selling price spent on ingredients
    foodCostPercentage: {
      type: Number,
      required: true,
      min: 0
    },


    // =================================================
    // POS
    // =================================================

    posEnabled: {
      type: Boolean,
      default: true
    },


    status: {
      type: String,

      enum: [
        'ACTIVE',
        'INACTIVE',
        'ARCHIVED'
      ],

      default: 'ACTIVE'
    },


    // =================================================
    // AUDIT
    // =================================================

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },

  {
    minimize: false
  }
);


// =====================================================
// UPDATE updatedAt
// =====================================================

RecipeSchema.pre(
  'save',
  function (next) {

    this.updatedAt = new Date();

    next();

  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  'Recipe',
  RecipeSchema
);
