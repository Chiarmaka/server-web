var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  Staff.findOne({ email: email })
    .exec(function (err, staff) {
      if (err) {
        return callback(err)
      } else if (!staff) {
        var err = new Error('Staff not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, staff.password, function (err, result) {
        if (result === true) {
          return callback(null, staff);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var staff = this;
  bcrypt.hash(staff.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    staff.password = hash;
    next();
  })
});


var Staff = mongoose.model('Staff', UserSchema);
module.exports = Staff;

