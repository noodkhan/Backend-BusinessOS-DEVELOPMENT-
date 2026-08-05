# 🍽️ Restaurant Management System - Backend API

<div align="center">

🚀 **Backend Service for Restaurant Business Management Platform**

A RESTful API system built to support restaurant operations including  
POS transactions, inventory purchasing, recipes, reports, customers, and business analytics.

</div>

---

# 📌 Introduction

The **Restaurant Management System Backend** is the core API service that powers the restaurant administration platform.

This backend provides a complete management system for restaurant owners and administrators to control daily operations, analyze business performance, and manage important restaurant data.

The system focuses on:

✅ Restaurant operation management  
✅ Sales and order processing  
✅ Inventory purchasing control  
✅ Recipe management  
✅ Business report generation  
✅ Customer relationship management (CRM)  
✅ Administrative management  

---

# 🏗️ System Architecture

```

┌─────────────────────┐
│   Vue.js Frontend   │
│  Admin Dashboard    │
└──────────┬──────────┘
│
│ REST API
│
┌──────────▼──────────┐
│   Express.js API    │
│   Node.js Backend   │
└──────────┬──────────┘
│
│ Database Operations
│
┌──────────▼──────────┐
│      MongoDB        │
│     Database        │
└─────────────────────┘

```

---

# 🛠️ Technologies Used

## Backend

| Technology | Purpose |
|---|---|
| 🟢 Node.js | Backend runtime environment |
| 🚂 Express.js | REST API framework |
| 🍃 MongoDB | Database system |
| 📦 Mongoose | MongoDB object modeling |
| 📤 Multer | File upload management |

---

# 📂 Project Structure

```

Backend
│
├── controllers
│   └── user
│       └── adminController.js
│
├── routes
│   └── user
│       └── adminRoutes.js
│
├── models
│   ├── Admin
│   ├── Purchase
│   ├── Recipe
│   ├── Order
│   ├── Report
│   └── Customer
│
├── middleware
│
├── uploads
│
└── server.js

```

---

# 🚀 API Documentation

Base URL:

```

/api/admin

```

---

# 👨‍💼 Administrator Management

## 🧪 Test API

### POST

```

/testing

```

Used for backend connection testing.

---

## 📝 Register Administrator

### POST

```

/register

````

Creates a new administrator account.

Example:

```json
{
    "username": "admin",
    "email": "admin@gmail.com",
    "password": "password"
}
````

---

## 👥 Get Registered Users

### GET

```
/registration
```

Retrieve all registered users.

---

# 🛒 Purchase Management

The purchase module manages supplier transactions and restaurant purchasing activities.

## 📦 Get All Purchases

### GET

```
/allpurchases
```

Returns all purchase records.

---

## ➕ Create Purchase

### POST

```
/purchases
```

Creates a new supplier purchase transaction.

Example:

```json
{
    "supplier":"Fresh Food Supplier",
    "items":[
        {
            "name":"Chicken",
            "quantity":20
        }
    ],
    "total":5000
}
```

---

# 🍔 Recipe Management

The recipe module controls restaurant menu information and ingredients.

## 📖 Get All Recipes

### GET

```
/allrecipes
```

Returns all available recipes.

---

## ➕ Create Recipe

### POST

```
/createrecipe
```

Creates a new restaurant recipe.

Example:

```json
{
    "name":"Classic Burger",
    "price":199,
    "ingredients":[
        {
            "item":"Beef",
            "amount":"200g"
        }
    ]
}
```

---

# 🧾 Order & POS Management

Handles restaurant sales transactions and customer orders.

## 📋 Get All Orders

### GET

```
/allorders
```

Retrieve all POS orders.

Example:

```json
{
    "success":true,
    "count":2,
    "data":[
        {
            "orderNumber":6812,
            "orderType":"dine-in",
            "items":[]
        }
    ]
}
```

---

## 🛍️ Create Order

### POST

```
/createorder
```

Creates a new restaurant order.

Supports:

🍽️ Dine-in
🥡 Takeaway
💳 POS Transactions

---

# 📊 Business Report System

The report system provides restaurant performance analysis.

Features:

📈 Business analytics
💰 Financial reports
🏪 Department reports
📅 Daily operation reports

---

## 📄 Create Report

### POST

```
/createreport
```

Creates a new business report.

Example:

```json
{
    "department":"kitchen",
    "reportType":"daily",
    "startDate":"2026-07-04",
    "endDate":"2026-07-04"
}
```

---

## 📚 Get All Reports

### GET

```
/allreports
```

Retrieve all generated reports.

---

## 🔎 Get Report By ID

### GET

```
/getreport/:id
```

Retrieve specific report information.

---

## ✏️ Update Report

### PUT

```
/updatereport/:id
```

Update existing reports.

---

## 🗑️ Delete Report

### DELETE

```
/deletereport/:id
```

Remove reports from the system.

---

# 👥 Customer Relationship Management (CRM)

The CRM module manages customer information.

Features:

✅ Customer registration
✅ Customer database
✅ Customer updates
✅ Customer deletion

---

## ➕ Create Customer

### POST

```
/createcustomer
```

Create new customer profile.

---

## 👀 Get Customers

### GET

```
/allcustomers
```

Retrieve all customers.

---

## 🔍 Get Customer Detail

### GET

```
/getcustomer/:id
```

Retrieve customer information.

---

## ✏️ Update Customer

### PUT

```
/updatecustomer/:id
```

Modify customer data.

---

## 🗑️ Delete Customer

### DELETE

```
/deletecustomer/:id
```

Remove customer record.

---

# 📤 File Upload System

The backend supports file uploading using **Multer**.

Supported formats:

```
📷 JPG
📷 JPEG
📷 PNG
🎞️ GIF
📄 PDF
📝 DOC
📝 DOCX
```

Maximum upload size:

```
10 MB
```

---

# ✅ Completed Features

| Feature                | Status      |
| ---------------------- | ----------- |
| 👨‍💼 Admin Management | ✅ Completed |
| 👥 User Registration   | ✅ Completed |
| 🛒 Purchase System     | ✅ Completed |
| 🍔 Recipe Management   | ✅ Completed |
| 🧾 POS Order System    | ✅ Completed |
| 📊 Business Reports    | ✅ Completed |
| 👥 Customer CRM        | ✅ Completed |
| 📤 File Upload         | ✅ Completed |

---

# 🔮 Future Development

Planned improvements:

🚀 JWT Authentication
🔐 Role-Based Access Control
📦 Automatic Inventory Deduction
📈 Real-time Dashboard Analytics
🔔 Notification System
🤖 AI Sales Forecasting
📊 Advanced Business Intelligence
💳 Payment Integration

---

# ⚙️ Installation

Clone repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

---

# 📦 Dependencies

Install packages:

```bash
npm install express mongoose multer
```

---

# 🌐 API Testing

Recommended tools:

🟠 Postman
🟢 Insomnia
🔵 Frontend Integration Testing

---

# 👨‍💻 Developer

**Restaurant Management System**

Backend developed with:

❤️ Node.js
⚡ Express.js
🍃 MongoDB

---

<div align="center">

⭐ If you find this project useful, consider giving it a star!

</div>
```


