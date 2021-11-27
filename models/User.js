const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

//create Schema

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Please add an ID'],
    unique: true,
    trim: true,
    maxlength: [10, 'ID must be less than 10 chars']
  },
  userName:{},
  userPhone:{},
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  //address convert to location(for Geocode working to API)
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Geocode & create location
  //run before going to save into database 
  
UserSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address
  this.address = undefined;
  next(); 
});

//export collections to database 
module.exports = mongoose.model('User', UserSchema);

