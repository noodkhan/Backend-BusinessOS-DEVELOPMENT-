const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

  orderNumber:{
    type:Number,
    required:true,
    unique:true
  },

  orderType:{
    type:String,
    enum:[
      'dine-in',
      'takeaway',
      'delivery'
    ],
    default:'dine-in'
  },


  items:[
    {

      recipeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Recipe',
        required:true
      },

      name:String,

      quantity:Number,

      unitPrice:Number,

      total:Number

    }
  ],


  subtotal:Number,

  discount:{
    type:Number,
    default:0
  },


  tax:{
    type:Number,
    default:0
  },


  total:Number,


  paymentMethod:{
    type:String,
    default:'Cash'
  },


  cashReceived:{
    type:Number,
    default:0
  },


  change:{
    type:Number,
    default:0
  },


  status:{
    type:String,
    default:'COMPLETED'
  },


  createdAt:{
    type:Date,
    default:Date.now
  }


});


module.exports =
mongoose.model(
  "Order",
  OrderSchema
);