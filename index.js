const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is up");
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.brxmqep.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function connectDb() {
  try {
    client.connect();
    console.log("data base connected");
  } catch (error) {
    console.log(error, "DATA BASE ");
  }
}

connectDb();

//****************** Collections **************************/
const Categories = client.db("FoodDeleverySystem").collection("Category");
const Restaurants = client.db("FoodDeleverySystem").collection("Restaurants");
const Products = client.db("FoodDeleverySystem").collection("Products");

//****************** Apis **************************/

// getting all categories
app.get("/allCategory", async (req, res) => {
  try {
    const query = {};
    const categories = await Categories.find(query).toArray();

    res.send({
      status: true,
      data: categories,
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: "",
    });
  }
});
// getting all Restaurants
app.get("/allRestaurants", async (req, res) => {
  try {
    const query = {};
    const restaurants = await Restaurants.find(query).toArray();

    res.send({
      status: true,
      data: restaurants,
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: "",
    });
  }
});
// getting all Products
app.get("/allProduct", async (req, res) => {
  try {
    const query = {};
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      const products = await Products.find(query).limit(limit).toArray();
      res.send({
        status: true,
        data: products,
        message: "",
      });
    } else {
      const products = await Products.find(query).toArray();
      res.send({
        status: true,
        data: products,
        message: "",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: "",
    });
  }
});

app.listen(port, () => {
  console.log("server is running");
});
