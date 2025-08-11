const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  homeName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photoUrl: String,
  description: String
});

// homeSchema.pre('findOneAndDelete', async function (next) {
//   const homeId = this.getQuery()._id;
//   await Favourite.deleteMany({ homeId: homeId });
//   next();
// });

module.exports = mongoose.model('Home', homeSchema);






