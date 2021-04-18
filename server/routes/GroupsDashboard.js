const router = require("express").Router();
const Users = require("../model/Users");
const Groups = require("../model/Groups");
const { checkAuth } = require("../Utils/passport");
var kafka = require("../kafka/client");
const mongoose = require("mongoose");

// Tested using postman
router.get("/mygroups/:user_id", checkAuth, async function (req, res) {
  kafka.make_request("mygroups", req.params, function (err, results) {
    console.log("in result");
    console.log("results in messagepost ", results);
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "Error",
      });
      res.status(400).end();
    } else {
      console.log("Inside else", results);
      res.status(200).send(results);
    }
  });
});

// Tested with Postman
router.get("/invitegroups/:user_id", checkAuth, async function (req, res) {
  console.log(req.params.user_id);
  const user = await Users.findOne({ _id: req.params.user_id });
  if (!user) {
    return res.status(400).send("Enter Valid Credentials!");
  }
  console.log(user.group);

  const arrayOfGroup = user.groupInvitedTo;
  const output = [];
  for (let i = 0; i < arrayOfGroup.length; i++) {
    const groupDetails = await Groups.findOne({ _id: arrayOfGroup[i] });
    //Groups.findOne({_id: ele}, )
    console.log(groupDetails.groupName);
    output.push(groupDetails.groupName);
    console.log(output);
  }
  console.log(output);

  res.status(200).send(output);
});

// Tested it.
router.post("/acceptInvite", checkAuth, async function (req, res) {
  console.log("/acceptInvite");
  const groupDetails = await Groups.findOne({ groupName: req.body.groupName });
  Users.findOneAndUpdate(
    { _id: req.body.userid },
    {
      $push: {
        group: groupDetails._id,
      },
    },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      Users.findOneAndUpdate(
        { _id: req.body.userid },
        {
          $pull: {
            groupInvitedTo: groupDetails._id,
          },
        },
        function (err, doc) {
          if (err) return res.send(500, { error: err });
          Groups.findOneAndUpdate(
            {
              _id: groupDetails._id,
            },
            {
              $push: {
                members: mongoose.Types.ObjectId(req.body.userid),
              },
            },
            function (err, doc) {
              if (err) return res.send(500, { error: err });
              return res.status(200).send("Succesfully saved.");
            }
          );
          // return res.status(200).send("Succesfully saved.");
        }
      );
    }
  );
  /* const user = await Users.findById(req.body.userid);
  const groupDetails = await Groups.findOne({ groupName: req.body.groupName });
  if (!user) {
    return res.status(400).send("Invalid Credentials!");
  }
  const arrayOfInvitedGroup = user.groupInvitedTo;
  for (let i = 0; i < arrayOfInvitedGroup.length; i++) {
    console.log(arrayOfInvitedGroup[i]);
    console.log(groupDetails._id);
    const str1 = arrayOfInvitedGroup[i] + "";
    const str2 = groupDetails._id;
    const val = str1.localeCompare(str2);
    if (val === 0) {
      console.log("Inside");
      arrayOfInvitedGroup.splice(i, 1);
    }
  }
  const arrayOfGroup = user.group;
  arrayOfGroup.push(groupDetails._id);
  user.group = arrayOfGroup;
  Users.findOneAndUpdate({ _id: req.body.user_id }, user, function (err, doc) {
    console.log("Hello");
    if (err) return res.send(500, { error: err });
    return res.status(200).send("Succesfully saved.");
  });*/
});

module.exports = router;