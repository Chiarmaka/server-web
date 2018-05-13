var express = require('express');
var router = express.Router();
var Staff = require('../models/staff');
var logger = require('morgan');





// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
  return res.sendFile(path.join(__dirname + '/templateLogReg/register.html'));
  
});

//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that staff typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var staffData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    Staff.create(staffData, function (error, staff) {
    
      if (error) {
        return next(error);
      } else {
        req.session.staffId = staff._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    Staff.authenticate(req.body.logemail, req.body.logpassword, function (error, staff) {
      if (error || !staff) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.staffId = staff._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  Staff.findById(req.session.staffId)
 // db.collection.find(req.session.staffId).sort({staffId : -1}).limit(1)
 .exec(function (error, staff) {
      if (error) {
        return next(error);
      } else {
        if (staff === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
        
          return res.send('<h1>Name: </h1>' + staff.username + '<h2>Mail: </h2>' + staff.email + 
          '<br> <p><iframe src="stream.html"></iframe></p> <a type="button" href="/logout">Logout</a>')
          
          }
        }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
