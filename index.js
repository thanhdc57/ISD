"use strict";
const express = require('express');
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const multer = require("multer");
const app = express();
const path = require('path');

app.use(express.json());
app.use(multer().none());
app.use(express.static(path.join(__dirname, './public')));

app.get('/', function(request, response) {
	// Render homepage template
  response.sendFile(path.join(__dirname, './public', 'dashboard.html'));
});


// get products info
app.get("/api/products", async function (req, res) {
  try {
    let database = await getDBConnection();
    let sqlShow = "select productID, productName, categoryName, supplierName, quantity, buyPrice, sellPrice FROM product inner join category on product.categoryID = category.categoryID inner join supplier on product.supplierID = supplier.supplierID";
    let datas = await database.all(sqlShow);
    await database.close();
    res.send(datas)
  } catch (error) {
    res.type("text");
    res.send("Error on the server");
  }
});


//get suppliers info
app.get("/api/suppliers", async function (req, res) {
  try {
    let database = await getDBConnection();
    let sqlShow = "select * from supplier";
    let datas = await database.all(sqlShow);
    await database.close();
    res.send(datas)
  } catch (error) {
    res.type("text");
    res.send("Error on the server");
  }
})

app.get("/api/categories", async function (req, res) {
  try {
    let database = await getDBConnection();
    let sqlShow = "select * from category";
    let datas = await database.all(sqlShow);
    await database.close();
    res.send(datas)
  } catch (error) {
    res.type("text");
    res.send("Error on the server");
  }
})


app.post("/api/insert/new/product", async function (req, res) {
  res.type("text");
  let n = req.body.pName;
  let category = req.body.pCategory;
  let supplier = req.body.pSupplier;
  let bprice = req.body.buyPrice;
  let sprice = req.body.sellPrice;
  if (
    n === undefined ||
    category === undefined ||
    supplier === undefined ||
    bprice === undefined ||
    sprice === undefined
  ) {
    res.status(400).send("Missing required paramaters");
  } else {
    try {
      let checkName = await getCheckName(n);
      //res.send(checkName);
      if (checkName === false) {
       res.send("Name input is the same as the name of the existing product.");
      } else {
        let c = await getCategoryID(category);
        let s = await getSupplierID(supplier);
        let dbs = await getDBConnection();
        let sql =
          "INSERT INTO product (productName, categoryID, supplierID, buyPrice, sellPrice ) VALUES (?,?,?,?,?);";
        await dbs.all(sql, [n.trim(), c, s, bprice, sprice]);
        await dbs.close();
       res.send("You have inserted new product successfully");
      }
    } catch {
      res.status(500).send("Something went wrong on the server.");
    }
  }
});


app.post("/api/edit/product", async function (req, res) {
  res.type("text");
  let pID = req.body.productID;
  let n = req.body.pName;
  let category = req.body.pCategory;
  let supplier = req.body.pSupplier;
  let bprice = req.body.buyPrice;
  let sprice = req.body.sellPrice;
  if (
    pID === undefined ||
    n === undefined ||
    category === undefined ||
    supplier === undefined ||
    bprice === undefined ||
    sprice === undefined
  ) {
    res.status(400).send("Missing required paramaters");
  } else {
    try {
      let oldName = await getProductName(pID);
      //res.send(oldName);
      let checkName;
      if (oldName != n) {
        checkName = await getCheckName(n);
        //res.send(checkName);
        if (checkName === false) {
          res.send(
            "Name input is the same as the name of the existing product."
          );
        }
      }
      if (oldName === n || checkName === true) {
        let ca = await getCategoryID(category);
        let sp = await getSupplierID(supplier);
        let dbs = await getDBConnection();
        let sql =
          "UPDATE product SET productName = ?,categoryID = ?,supplierID = ?,buyPrice = ?,sellPrice =? WHERE productID = ?;";
        await dbs.all(sql, [n.trim(), ca, sp, bprice, sprice, pID]);
        await dbs.close();
        res.send("You have edited product successfully");
      }
    } catch {
      res.status(500).send("Something went wrong on the server.");
    }
  }
});

app.post("/api/delete/product", async function (req, res) {
  res.type("text");
  let pID = req.body.productID;
  try {
    let db = await getDBConnection();
    let sql = "DELETE FROM product WHERE productID = ?;";
    await db.all(sql, pID);
    await db.close();
    res.send("You have deleted the product successfully");
  } catch {
    res.status(500).send("Something went wrong on the server.");
  }
});

// function filter products by category, supplier
app.post("/api/filter", async function (req, res) {
  res.type("text")
  let category = req.body.pCategory
  let supplier = req.body.pSupplier

  if(category == undefined || supplier == undefined){
    res.status(400).send("Missing required paramaters");
  } else{
    // filter by supplier
    if(category == '' && supplier != ''){
        try {
          let db = await getDBConnection();
          let sqlShow = "SELECT productID, productName, categoryName, supplierName, quantity, buyPrice, sellPrice FROM product inner join category on product.categoryID = category.categoryID inner join supplier on product.supplierID = supplier.supplierID where supplierName = ?;";
          let data = await db.all(sqlShow,supplier);
          await db.close();
          res.send(data);
        }catch {
          res.status(500).send("Something went wrong on the server.")
        }
        // filter by category
      } else if (supplier == '' && category != ''){
        try {
          let db = await getDBConnection();
          let sqlShow = "SELECT productID, productName, categoryName, supplierName, quantity, buyPrice, sellPrice FROM product inner join category on product.categoryID = category.categoryID inner join supplier on product.supplierID = supplier.supplierID where categoryName = ?;";
          let data = await db.all(sqlShow,category);
          await db.close();
          res.send(data);
        } catch {
          res.status(500).send("Something went wrong on the server.");
        }
        // gui ve het tat ca cac product neu ng dung k chon gi
      } else if (category == '' && supplier == ''){
        try {
          let db = await getDBConnection();
          let sqlShow = "SELECT * FROM product;";
          let data = await db.all(sqlShow);
          await db.close();
          res.send(data);
        }catch {
          res.status(500).send("Something went wrong on the server.")
        }
        // filter by supplier and category
      } else{
        try {
          let db = await getDBConnection();
          let sqlShow = "SELECT productID, productName, categoryName, supplierName, quantity, buyPrice, sellPrice FROM product inner join category on product.categoryID = category.categoryID inner join supplier on product.supplierID = supplier.supplierID where categoryName = ? AND supplierName = ?;";
          let data = await db.all(sqlShow,[category,supplier]);
          await db.close();
          res.send(data);
        } catch {
          res.status(500).send("Something went wrong on the server.");
        }
      }
  }

})


async function getCategoryID(category) {
  let db = await getDBConnection();
  let sql = "SELECT categoryID FROM category WHERE categoryName = ?;";
  let rows = await db.all(sql, category);
  let categoryID;
  for (let i = 0; i < rows.length; i++) {
    categoryID = rows[i]["categoryID"];
  }
  await db.close();
  return categoryID;
}

async function getSupplierID(supplier) {
  let db = await getDBConnection();
  let sql = "SELECT supplierID FROM supplier WHERE supplierName = ?;";
  let rows = await db.all(sql, supplier);
  let supplierID;
  for (let i = 0; i < rows.length; i++) {
    supplierID = rows[i]["supplierID"];
  }
  await db.close();
  return supplierID;
}

async function getCheckName(name) {
  let db = await getDBConnection();
  let sql = "SELECT productName FROM product;";
  let rows = await db.all(sql);
  let checkname = true;
  for (let i = 0; i < rows.length; i++) {
    if (name.trim() === rows[i]["productName"].trim()) {
      checkname = false;
      break;
    }
  }
  await db.close();
  return checkname;
}

async function getProductName(productID) {
  let db = await getDBConnection();
  let sql = "SELECT productName FROM product WHERE productID = ?;";
  let rows = await db.all(sql, productID);
  let name;
  for (let i = 0; i < rows.length; i++) {
    name = rows[i]["productName"];
  }
  await db.close();
  return name;
}


async function getDBConnection() {
  const db = await sqlite.open({
    filename: "inventory.db",
    driver: sqlite3.Database,
  });
  return db;
}

const PORT = 8000;
app.listen(PORT);