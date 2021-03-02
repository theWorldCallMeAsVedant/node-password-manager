const express = require("express");
const app = express();
const port = 80;

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/myCredentials", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("successfully connected")).catch((err)=>console.log(err));

// Sign in schema

const schema = mongoose.Schema({
  website: String,
  gmail: String,
  password: String,
});

//Creating model
var accountModel = mongoose.model("accounts", schema);

// public folder path
app.use(express.static("public"));

// middle ware to parse the form details
app.use(express.urlencoded({ extended: false }));

// responding to the get request
app.get("/", (req, res) => {
  res.render("index.html");
});

// listening to sign in request
app.post("/sign-in", (req, res) => {
  var signInpassword = req.body.password;
  var signIngmail = req.body.gmail;
  var website = req.body.website;

  var details = new accountModel({
    website: website,
    gmail: signIngmail,
    password: signInpassword,
  });

  details.save();

  res.send(
    "<h1>Your data has been successfully recorded , now you get the data anytime you want</h1>"
  );
});

// listening to login request
app.post("/login", async (req, res) => {
  try {
    var website = req.body.website;

    const result = await accountModel.findOne({ website: website });

    if (result) {
      res.send(result);
    } else {
      res.send("There is no such name");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// listening to the entered port
app.listen(port, () => {
  console.log(`app is successfully listening on ${port}`);
});
