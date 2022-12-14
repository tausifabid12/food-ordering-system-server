const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const Users = client.db("FoodDeleverySystem").collection("Users");
const DeliveryMan = client.db("FoodDeleverySystem").collection("DeliveryMan");
const Cart = client.db("FoodDeleverySystem").collection("Cart");
const Orders = client.db("FoodDeleverySystem").collection("Orders");
// const Restaurants = client.db("FoodDeleverySystem").collection("Restaurants");

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

// separate categories products
app.get("/catProducts/:catName", async (req, res) => {
  try {
    const { catName } = req.params;
    const query = { category: catName };
    const products = await Products.find(query).toArray();

    res.send({
      status: true,
      data: products,
      message: catName,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: req.params.catName,
    });
  }
});

// getting restaurant specific products
app.get("/myProducts", async (req, res) => {
  try {
    const email = req.query.email;

    const filter = { email: email };

    const products = await Products.find(filter).toArray();
    res.send({
      status: true,
      data: products,
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

// getting top rated products
app.get("/topRatedProducts", async (req, res) => {
  try {
    const filter = { rating: { $gt: 4 } };

    const products = await Products.find(filter).toArray();
    res.send({
      status: true,
      data: products,
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

app.post("/allProduct", async (req, res) => {
  try {
    const productInfo = req.body;
    const result = await Products.insertOne(productInfo);
    res.send({
      status: true,
      data: result,
      message: "product added",
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

// deleting products
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const filter = { _id: ObjectId(id) };
    const result = await Products.deleteOne(filter);

    res.send({
      status: true,
      data: result,
      message: "Products removed",
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

//* cart api
app.get("/cart", async (req, res) => {
  try {
    const email = req.query.email;
    const query = { email: email };
    const cartProducts = await Cart.find(query).toArray();

    res.send({
      status: true,
      data: cartProducts,
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

app.post("/cart", async (req, res) => {
  try {
    const cartInfo = req.body;
    const result = await Cart.insertOne(cartInfo);
    res.send({
      status: true,
      data: result,
      message: "added to cart",
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

app.delete("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const filter = { productId: id };
    const result = await Cart.deleteOne(filter);

    res.send({
      status: true,
      data: result,
      message: "Order removed",
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

app.delete("/clearCart/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const filter = { email: email };
    const result = await Cart.deleteMany(filter);

    res.send({
      status: true,
      data: result,
      message: "Order removed",
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

//* user apis

// getting all user
app.get("/users", async (req, res) => {
  try {
    const query = {};
    const users = await Users.find(query).toArray();
    res.send({
      status: true,
      data: users,
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

//getting single user info
app.get("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const user = await Users.findOne(query);
    res.send({
      status: true,
      data: user,
      message: "single user",
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

// creating user
app.post("/users", async (req, res) => {
  try {
    const userInfo = req.body;
    const result = await Users.insertOne(userInfo);
    res.send({
      status: true,
      data: result,
      message: "data inserted",
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

//* restaurant apis

//getting all restaurant
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
//finding single restaurant
app.get("/allRestaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const filter = { _id: ObjectId(id) };

    const result = await Restaurants.findOne(filter);

    res.send({
      status: true,
      data: result,
      message: "restaurant data",
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
//finding single restaurant using email
app.get("/restaurantInfo", async (req, res) => {
  try {
    const email = req.query.email;
    const filter = { email: email };
    const result = await Restaurants.findOne(filter);

    res.send({
      status: true,
      data: result,
      message: "restaurant data",
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

//approving restaurant
app.patch("/allRestaurants/:id", async (req, res) => {
  try {
    const info = req.body;
    const { id } = req.params;

    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: info,
    };
    const result = await Restaurants.updateOne(filter, updateDoc, options);

    res.send({
      status: true,
      data: result,
      message: "restaurant approved",
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

//adding restaurant
app.post("/addRestaurant", async (req, res) => {
  try {
    const restaurantInfo = req.body;
    const result = await Restaurants.insertOne(restaurantInfo);
    res.send({
      status: true,
      data: result,
      message: "data inserted",
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

//deleting restaurant
app.delete("/allRestaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const filter = { _id: ObjectId(id) };
    const result = await Restaurants.deleteOne(filter);

    res.send({
      status: true,
      data: result,
      message: "restaurant removed",
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

//delivery man apis
app.get("/allDeliveryMan", async (req, res) => {
  try {
    const query = {};
    const deliveryMan = await DeliveryMan.find(query).toArray();

    res.send({
      status: true,
      data: deliveryMan,
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

//approving restaurant
app.put("/allDeliveryMan/:id", async (req, res) => {
  try {
    const info = req.body;
    const { id } = req.params;

    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: info,
    };
    const result = await DeliveryMan.updateOne(filter, updateDoc, options);

    res.send({
      status: true,
      data: result,
      message: "DeliveryMan approved",
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

app.post("/addDeliveryMan", async (req, res) => {
  try {
    const orderInfo = req.body;
    const result = await DeliveryMan.insertOne(orderInfo);
    res.send({
      status: true,
      data: result,
      message: "data inserted",
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
//deleting DeliveryMan
app.delete("/allDeliveryMan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const filter = { _id: ObjectId(id) };
    const result = await DeliveryMan.deleteOne(filter);

    res.send({
      status: true,
      data: result,
      message: "DeliveryMan removed",
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

//* orders api
//getting restaurant orders
app.get("/allOrders", async (req, res) => {
  try {
    const email = req.query.email;
    const AllOrdersInfo = await Orders.find({}).toArray();
    const result = AllOrdersInfo[0].orderProductsInfo.filter(
      (p) => p?.restaurantEmail === email
    );

    res.send({
      status: true,
      data: result,
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

// posting orders
app.post("/addOrder", async (req, res) => {
  try {
    const orderInfo = req.body;
    const result = await Orders.insertOne(orderInfo);
    res.send({
      status: true,
      data: result,
      message: "data inserted",
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

app.listen(port, () => {
  console.log("server is running");
});
