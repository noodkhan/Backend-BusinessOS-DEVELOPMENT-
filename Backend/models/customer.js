const mongoose = require("mongoose");


const customerSchema = new mongoose.Schema(
{
    customerNumber:{
        type:String,
        unique:true
    },

    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    email:{
        type:String
    },


    location:{
        type:String,
        default:"Unknown"
    },


    type:{
        type:String,
        enum:[
            "Dine-in",
            "Takeaway",
            "Delivery"
        ],
        default:"Dine-in"
    },


    segment:{
        type:String,
        enum:[
            "VIP",
            "Regular",
            "New",
            "At Risk"
        ],
        default:"New"
    },


    loyalty:{
        type:String,
        enum:[
            "Bronze",
            "Silver",
            "Gold",
            "Platinum"
        ],
        default:"Bronze"
    },


    visits:{
        type:Number,
        default:0
    },


    totalSpent:{
        type:Number,
        default:0
    },


    averageOrder:{
        type:Number,
        default:0
    },


    points:{
        type:Number,
        default:0
    },


    health:{
        type:String,
        enum:[
            "Healthy",
            "Needs Attention",
            "At Risk"
        ],
        default:"Healthy"
    },


    favoriteMenu:{
        type:String,
        default:"None"
    },


    notes:{
        type:String,
        default:""
    },


    lastVisit:{
        type:Date
    },


    activities:[
        {
            title:String,
            date:Date
        }
    ]

},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Customer",
    customerSchema
);