const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then(registeredHomes => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    })
  });
};

exports.postAddHome = (req, res, next) => {
  const { homeName, price, location, rating, photoUrl, description } = req.body;
  const home = new Home({ homeName, price, location, rating, photoUrl, description });
  home.save().then(() => {
    console.log("Home added successfully");
  });
  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const { id, homeName, price, location, rating, photoUrl, description } = req.body;
  Home.findById(id).then(home => {
    home.homeName = homeName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.photoUrl = photoUrl;
    home.description = description;
    home.save().then((result) => {
      console.log("Home updated successfully", result);
    }).catch(error => {
      console.log("Error while updating home: ", error);
    })
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log("Error while finding home for update: ", error);
  });
}
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId).then(() => {
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log('Error while deleting ', error);
  });
};