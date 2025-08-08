const db = require("../utils/databaseUtil.js");

module.exports = class Home {
  constructor(homeName, price, location, rating, photoUrl, description, id) {
    this.homeName = homeName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
    this.id = id;
  }

  save() {
    if (this.id) {
      return db.execute(`UPDATE homes SET homeName=?, price=?, location=?, rating=?, photoUrl=?, description=? WHERE id=?`, [this.homeName, this.price, this.location, this.rating, this.photoUrl, this.description, this.id]);
    } else {
      return db.execute("INSERT INTO homes(homeName, price, location, rating, photoUrl, description) VALUES (?, ?, ?, ?, ?, ?)", [this.homeName, this.price, this.location, this.rating, this.photoUrl, this.description]);
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM homes");
  }

  static findById(homeId) {
    return db.execute("SELECT * FROM homes WHERE id=?", [homeId]);
  }

  static deleteById(homeId) {
    return db.execute("DELETE FROM homes WHERE id=?", [homeId]);
  }
};