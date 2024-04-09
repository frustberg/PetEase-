const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const {MongoClient} = require('mongodb');
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const findOrCreate = require("mongoose-findorcreate");
const Contacts = require('./checkout');
const checkout = require("./checkout");
const uri = 'mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB';

const app = express();

mongoose.set('strictQuery', false);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));

app.use(session({
  secret: "Our Little Secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
// app.use(passport.session());

// mongoose.connect("mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB");

// mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB

async function connect() {
  try{
    await mongoose.connect("mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB", {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected with MongoDB');
  } catch {
    console.log('Error -> $(error)');
  }
}

connect();  

const contactSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fName: String,
  lName: String,
  email: String,
  phone: Number,
  address: String,
  dAddress: String,
  country: String,
  state: String,
  zip: Number
});

const userSchema = new mongoose.Schema({
  petname: String,
  breed: String,
  age: String,
  price: String
});

const checkoutSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  fName: String,
  lName: String,
  email: String,
  phone: Number,
  address: String,
  dAddress: String,
  city: String,
  state: String,
  country: String,
  zip: Number
});

const NewpetSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: String,
  type: String,
  age: String,
  breed: String,
  price: Number
});


  
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Contact = new mongoose.model("Contact", contactSchema);
const Buyer = mongoose.model('Buyer', checkoutSchema);
const AddedNewpet = mongoose.model('Newpet', NewpetSchema);

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


app.get("/", function(req, res) {
  res.render("home")
});

app.get("/login1", function(req, res) {
  res.render("login1")
});


app.get("/home", function(req, res) {
  res.render("home")
});

app.get("/main", function(req, res) {
  res.render("main")
});

app.get("/main1", function(req, res) {
  res.render("main1")
});

app.get("/register1",  function(req, res) {
  res.render("register1")
});

app.get("/buying", function(req, res) {

  Contact.find({}, function(err, detailItems){

    if(detailItems.length === 0){
      Contact.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else {
          console.log("Successfully saved all items to the DB.");
        }
      });
      res.redirect("/");
    } else{
      res.render("buying");
    }
  });

});

app.get("/contact", function(req, res) {
  res.render("contact")
});

app.get("/addPet", function(req, res) {
  res.render("addPet")
});

// app.get("/addpets", function(req, res) {
//   // AddedNewpet.find({}, function(err, newpets) {
//   //   res.render("addpets", {
//   //     addedpetsList: newpets
//   //   });
//   // });
//   res.render("addpets")
// });

// app.get('/addpets', async (req, res) => {
//   try {
//     const orders = await AddedNewpet.find();
//     res.render('addpets', { orders: orders });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('An error occurred while retrieving orders.');
//   }
// });

app.get('/checkout', function(req, res) {
  res.render('checkout');
});

app.get('/buyingpage', function(req, res) {
  res.render('buyingpage');
});

app.post("/register", function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
      if(err){
          console.log(err);
          // res.redirect("/main1");
      } else {
          passport.authenticate("local")(req, res, function(){
              res.redirect("/home");
          });
      }
  });
});

app.post("/login", function(req, res){
    
  const user = new User({
      username: req.body.username,
      password: req.body.password
  });

  req.login(user, function(err){
      if(err){
          console.log(err);
          // res.redirect("/main1");
      } else {
          passport.authenticate("local")(req, res, function(){
              res.redirect("/main1");
          });
      }
  });

});

app.post('/buying', async (req, res) => {
  const client = new MongoClient('mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB');
  const checkoutDetails = {
    _id: new mongoose.Types.ObjectId,
    fName: req.body.firstName,
    lName: req.body.lastName,
    email: req.body.email,
    phone: parseInt(req.body.phoneNo),
    address: req.body.address,
    dAddress: req.body.detailAddress,
    country: req.body.country,
    state: req.body.state,
    zip: parseInt(req.body.zip)
  };

  try {
    await client.connect();
    const db = client.db('petappDB');
    const result = await db.collection('checkouts').insertOne(checkoutDetails);

    if (result.insertedCount === 1) {
      res.redirect("main1")
    } else {
      res.redirect("main1")
      // res.send('<html><div class="alert alert-danger" role="alert">Data not saved to the database.</div></html>');
    }
  } catch (error) {
    console.error(error);
    res.send('<html><div class="alert alert-danger" role="alert">Error: Data not saved to the database.</div></html>');
  } finally {
    await client.close();
  }
});

app.post("/addpets", async (req, res) => {
  const addedpets = new AddedNewpet({
    // _id: new mongoose.Types.ObjectId,
    name: req.body.addCPettype,
    type: req.body.petimage,
    age: req.body.petage,
    breed: req.body.addCPetbreed,
    price: req.body.addCPrice,
  });
  try {
    await addedpets.save(); // Save the order to the database
    res.redirect('/main1'); // Redirect the user to a thank-you page
  } catch (err) {
    console.error(err);
    res.render('checkout', { error: 'An error occurred. Please try again.' }); // Render the checkout form with an error message
  }
});


// app.get("/addpet/:addpetId", function(re, res) {
//   const addpetId = req.params.addpetId;

//   db.collection('petappDB').findOne({_id: addpetId}, function(err, product) {
//     if (err) {
//       console.log(err);
//       res.status(500).send('Error retrieving product data');
//     } else if (!product) {
//       res.status(404).send('Product not found');
//     } else {
//       // Render product card using EJS template
//       res.render('product_card.ejs', {product: product});
//     }
//   });


// })

// app.get('/product/:productId', function(req, res) {
//   const productId = req.params.productId;

//   // Retrieve product data from MongoDB
//   db.collection('<your-collection-name>').findOne({_id: productId}, function(err, product) {
//     if (err) {
//       console.log(err);
//       res.status(500).send('Error retrieving product data');
//     } else if (!product) {
//       res.status(404).send('Product not found');
//     } else {
//       // Render product card using EJS template
//       res.render('product_card.ejs', {product: product});
//     }
//   });
// });


// app.post('/addpet', async (req, res) => {
//   const client = new MongoClient('mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB');
//   const addedPet = {
//     _id: new mongoose.Types.ObjectId,
//     name: req.body.petname,
//     type: req.body.type,
//     age: req.body.petage,
//     breed: req.body.petbreed,
//     price: req.body.petprice,
//     // image: req.body.image
//   };

//   try {
//     await client.connect();
//     const db = client.db('petappDB');
//     const result = await db.collection('addedPets').insertOne(addedPet);

//     if (result.insertedCount === 1) {
//       res.redirect("main1")
//     } else {
//       res.redirect("main1")
//       // res.send('<html><div class="alert alert-danger" role="alert">Data not saved to the database.</div></html>');
//     }
//   } catch (error) {
//     console.error(error);
//     res.send('<html><div class="alert alert-danger" role="alert">Error: Data not saved to the database.</div></html>');
//   } finally {
//     await client.close();
//   }
// });


// const Checkout = mongoose.model('Checkout', checkoutSchema)

app.post('/checkout', async (req, res) => {
  const checkout = new Buyer({
    // _id: new mongoose.Types.ObjectId,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.cemail,
    phone: req.body.cphone,
    address: req.body.caddress,
    dAddress: req.body.cdaddress,
    city: req.body.ccity,
    state: req.body.cstate,
    country: req.body.ccountry,
    zip: req.body.czip
  });
  try {
    await checkout.save(); // Save the order to the database
    res.redirect('/checkout'); // Redirect the user to a thank-you page
  } catch (err) {
    console.error(err);
    res.render('checkout', { error: 'An error occurred. Please try again.' }); // Render the checkout form with an error message
  }
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// CHatGPT addpet routes



// const MongoClient = require('mongodb').MongoClient;

// // Connection URL and database name
// const url = 'mongodb+srv://frustbergx27:Abhishek%40123@cluster0.sktcmoo.mongodb.net/petappDB';
// const dbName = 'petappDB';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   if(err) throw err;

//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   const collection = db.collection('addedPets');
  
//   collection.find({}).toArray(function(err, docs) {
//     if (err) throw err;
//     if (docs.length > 0) {
//       docs.forEach((row) => {
//         console.log(`
//           <div class="col-md-3 mb-3">
//             <div class="card">
//               <img src="${row.image}" class="card-img-top" width=200px height=200px alt="Error loading image!">
//               <div class="card-body">
//                 <h5 class="card-title">${row.pdestination}</h5>
//                 <h6 class="card-title">Package ID: ${row.package_id}</h6>
//                 <h6 class="card-title">Price: ${row.pamount}</h6>
//                 <p class="card-text">Date: ${row.pdate}</p>
//                 <p class="card-text">Number of days: ${row.pdays}</p>
//                 <p class="card-text">Mode of transportation: ${row.ptransportation}</p>
//                 <p class="card-text">Total vacancies: ${row.pvacancy}</p>
//                 <p class="card-text">Tour type: ${row.ptype}</p>
//                 <p class="card-text">Tour category: ${row.pcategory}</p>
//                 <a href="reservation.php" class="btn text-light rounded" style="background-color:black">Reserve your seat</a>
//               </div>
//             </div>
//           </div>
//         `);
//       });
//     }
//   });

//   // Close the client
//   client.close();
// });



