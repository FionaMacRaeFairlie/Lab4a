const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

const nedb = require("nedb");
const db = new nedb({ filename: "emp.db", autoload: true });
console.log("db created");

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

/*db.insert({ name: "Fred Flintstone" }, function (err, newDoc) {
  if (err) {
    console.log("error", err);
  } else {
    console.log("document inserted", newDoc);
  }
});*/
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.post("/add", function (req, res) {
  console.log(req.body.name);
  db.insert({ name: req.body.name }, function (err, docs) {
    if (err) {
      console.log("error", err);
    } else {
      console.log("document inserted", docs);
      res.render('employeeChange', {
        'change': ' added to database',
        'employee': docs
       })
    }
  });
});
// View
app.post("/view", function (req, res) {
  db.find({_id:req.body.id}, function (err, doc) {
    if (err) {
      console.log("error");
    } else {
      console.log(doc);
    console.log("documents retrieved: ", doc);
      res.render('employeeData', {
         'employee': doc
        });
    // res.json(doc);
    }
  });
});
//Update
app.post("/update", function (req, res) {
  db.update(
    { _id: req.body._id  },
    { $set: { name: req.body.name  } },
    {},
    function (err, docs) {
      if (err) {
        console.log("error updating documents", err);
      } else {
        console.log(docs, "documents updated");
        res.render('employeeChange', {
          'change': 'changed in database',
          'employee': docs
         })
      }
    }
  );
});
// showAll
app.post("/showAll", function (req, res) {
  db.find({}, function (err, doc) {
    if (err) {
      console.log("error");
    } else {
        res.render('employees', {
         'employee': doc
        })
    }
  });
});
//Delete
app.post("/delete", function (req, res) {
  db.remove({ _id: req.body.id  }, {}, function (err, docs) {
    if (err) {
      console.log("error deleting document");
    } else {
      console.log(docs, "document removed from database");
      res.render('employeeChange', {
        'change': 'removed from database',
        'number': docs
       })
    }
  });
});
app.listen(3000, () => {
  console.log('Server started on port 3000. Ctrl^c to quit.');
  })