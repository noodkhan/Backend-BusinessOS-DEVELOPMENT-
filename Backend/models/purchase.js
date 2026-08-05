// models/Purchase.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// =====================================================
// PURCHASE ITEM SCHEMA
// =====================================================

const PurchaseItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    unit: {
      type: String,
      required: true,
      trim: true
    },

    unitCost: {
      type: Number,
      required: true,
      min: 0
    },

    total: {
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
// PURCHASE SCHEMA
// =====================================================

const PurchaseSchema = new Schema(
  {
    // Purchase Information

    purchaseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    purchaseDate: {
      type: Date,
      required: true
    },

    expectedDeliveryDate: {
      type: Date,
      required: false
    },

    actualDeliveryDate: {
      type: Date,
      required: false
    },


    // Supplier

    supplierName: {
      type: String,
      required: true,
      trim: true
    },


    // Purchase Items

    items: {
      type: [PurchaseItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: 'Purchase must contain at least one item.'
      }
    },


    // Payment Information

    paymentStatus: {
      type: String,
      enum: [
        'Unpaid',
        'Partially Paid',
        'Paid'
      ],
      default: 'Unpaid'
    },

    paymentMethod: {
      type: String,
      enum: [
        'Cash',
        'Bank Transfer',
        'Credit Card',
        'Debit Card',
        'Cheque',
        'Credit'
      ],
      default: 'Cash'
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0
    },

    paymentDueDate: {
      type: Date,
      required: false
    },


    // Financial Summary

    subtotal: {
      type: Number,
      required: true,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    balanceDue: {
      type: Number,
      default: 0,
      min: 0
    },


    // Audit

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

PurchaseSchema.pre(
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
  'Purchase',
  PurchaseSchema
);


// {
//   "purchaseNumber": "PO-2026-0006",
//   "purchaseDate": "2026-07-29",
//   "expectedDeliveryDate": "2026-07-30",
//   "actualDeliveryDate": null,
//   "supplierName": "Fresh Food Supplier",
//   "items": [
//     {
//       "name": "Chicken Breast",
//       "quantity": 10,
//       "unit": "kg",
//       "unitCost": 125,
//       "total": 1250
//     },
//     {
//       "name": "Beef",
//       "quantity": 5,
//       "unit": "kg",
//       "unitCost": 350,
//       "total": 1750
//     },
//     {
//       "name": "Garlic",
//       "quantity": 2,
//       "unit": "kg",
//       "unitCost": 80,
//       "total": 160
//     }
//   ],
//   "paymentStatus": "Partially Paid",
//   "paymentMethod": "Cash",
//   "amountPaid": 2000,
//   "paymentDueDate": "2026-08-05",
//   "subtotal": 3160,
//   "total": 3160,
//   "balanceDue": 1160
// }