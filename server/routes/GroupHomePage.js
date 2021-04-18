const router = require("express").Router();
const mongoose = require("mongoose");
const Groups = require("../model/Groups");
const Bills = require("../model/Bills");
const Users = require("../model/Users");
const Transaction = require("../model/Transaction");
const { checkAuth } = require("../Utils/passport");

/* Tested using Postman*/
router.get("/getBillsOfGroup/:groupName", checkAuth, async function (req, res) {
  console.log(req.params.groupName);
  // const groupName = req.params.groupName;
  const groupDetails = await Groups.findOne({
    groupName: req.params.groupName,
  });
  const arrayOfBills = groupDetails.bills;
  const output = [];
  console.log(groupDetails);
  for (let i = 0; i < arrayOfBills.length; i++) {
    const billDetails = await Bills.findById(arrayOfBills[i]);
    // const createdBy = await Users.findById(billDetails.createdBy);
    const bill = {
      descirption: billDetails.billDesc,
      total_amount: billDetails.billAmount,
      email: billDetails.createdBy,
      timestamp: billDetails.billTimestamp,
    };
    console.log(bill);
    console.log(i);
    output.push(bill);
    if (i === arrayOfBills.length - 1) {
      res.status(200).send(output);
    }
  }
});

/*
Tested Using Postman
*/
router.get(
  "/getMembersOfGroup/:groupName",
  checkAuth,
  async function (req, res) {
    const params = req.params.groupName.split("&");
    const groupDetails = await Groups.findOne({
      groupName: params[0],
    });
    /*
    const transactionOfGroup1 = await Transaction.find({
      group_id: groupDetails._id,
      sender: params[1],
    });
    const transactionOfGroup2 = await Transaction.find({
      group_id: groupDetails._id,
      receiver: params[1],
    });
    const transactionOfGroup = transactionOfGroup1.concat(transactionOfGroup2);
    const result = [];
    for (let i = 0; i < transactionOfGroup.length; i++) {
      const user_1 = await Users.findOne({ _id: transactionOfGroup[i].sender });
      const user_2 = await Users.findOne({
        _id: transactionOfGroup[i].receiver,
      });
      const eachTrans = {
        user_1: user_1.fullname,
        user_2: user_2.fullname,
        final_amount: transactionOfGroup[i].amount,
      };
      console.log(eachTrans);
      result.push(eachTrans);
      if (i == transactionOfGroup.length - 1) {
        res.status(200);
        res.send(result);
      }
    }*/

    console.log(groupDetails);
    const members = groupDetails.members;
    const output = [];
    for (let i = 0; i < members.length; i++) {
      const memberName = await Users.findById(members[i]);
      output.push(memberName.fullname);
    }
    res.status(200).send(output);
  }
);

router.post("/leaveGroup", checkAuth, async function (req, res) {
  const groupDetails = await Groups.findOne({
    groupName: req.body.groupName,
  });

  const transactionOfGroup1 = await Transaction.find({
    group_id: groupDetails._id,
    sender: req.body.userId,
  });
  const transactionOfGroup2 = await Transaction.find({
    group_id: groupDetails._id,
    receiver: req.body.userId,
  });
  const transactionOfGroup12 = transactionOfGroup1.concat(transactionOfGroup2);
  const transactionOfGroup3 = await Transaction.find({
    group_id: mongoose.Types.ObjectId("00000000e332f843a87180a0"),
    receiver: req.body.userId,
  });
  const transactionOfGroup4 = await Transaction.find({
    group_id: mongoose.Types.ObjectId("00000000e332f843a87180a0"),
    sender: req.body.userId,
  });
  const transactionOfGroup34 = transactionOfGroup3.concat(transactionOfGroup4);
  const transactionOfGroup = transactionOfGroup12.concat(transactionOfGroup34);
  console.log(transactionOfGroup);
  const result = [];
  for (let i = 0; i < transactionOfGroup.length; i++) {
    const user_1 = await Users.findOne({ _id: transactionOfGroup[i].sender });
    const user_2 = await Users.findOne({
      _id: transactionOfGroup[i].receiver,
    });
    const eachTrans = {
      user_1: user_1.fullname,
      user_2: user_2.fullname,
      final_amount: transactionOfGroup[i].amount,
    };
    console.log(eachTrans);
    result.push(eachTrans);
  }
  const userDetails1 = await Users.findById(req.body.userId);
  const fullname = userDetails1.fullname;
  const friends = new Map();
  result.forEach((ele) => {
    // console.log(ele.user_1);
    // console.log(ele.user_2);
    if (ele.user_1 === fullname) {
      // console.log('inside 1');
      friends.set(ele.user_2, 0);
    } else {
      // console.log('inside 2');
      friends.set(ele.user_1, 0);
    }
  });
  result.forEach((ele) => {
    if (ele.user_1 === fullname) {
      const amount = friends.get(ele.user_2) + ele.final_amount;
      friends.set(ele.user_2, amount);
    } else {
      const amount = friends.get(ele.user_1) - ele.final_amount;
      friends.set(ele.user_1, amount);
    }
  });
  // eslint-disable-next-line no-restricted-syntax
  let flag = true;
  for (const [key, value] of friends.entries()) {
    console.log(value);
    if (value !== 0) {
      flag = false;
    }
  }

  if (flag) {
    Groups.findOneAndUpdate(
      {
        _id: groupDetails._id,
      },
      {
        $pull: {
          members: req.body.userId,
        },
      },
      function (err, doc) {
        Users.findOneAndUpdate(
          {
            _id: req.body.userId,
          },
          {
            $pull: {
              group: groupDetails._id,
            },
          },
          function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.status(200).send("Succesfully saved.");
          }
        );
      }
    );
  } else {
    res.status(500).send("Unable to leave group");
  }
});

/* Tested Using Postman */
router.post("/addBill", checkAuth, async function (req, res) {
  const userDetails = await Users.findById(req.body.userId);
  console.log(userDetails);
  const bill = new Bills({
    billAmount: req.body.amount,
    createdBy: userDetails.fullname,
    billDesc: req.body.description,
  });

  const saveBill = await bill.save();
  console.log(saveBill);
  if (saveBill) {
    const groupDetails = await Groups.findOne({
      groupName: req.body.group,
    });
    const arrayOfBills = groupDetails.bills;
    arrayOfBills.push(saveBill._id);
    groupDetails.bills = arrayOfBills;
    Groups.findOneAndUpdate(
      { _id: groupDetails._id },
      groupDetails,
      async function (err, doc) {
        if (err) return res.send(500, { error: err });
        const membersArray = groupDetails.members;
        membersArray.forEach(async (ele) => {
          // console.log(typeof ele);
          // console.log(typeof req.body.userId);
          const user1 = JSON.stringify(ele);
          const user2 = JSON.stringify(req.body.userId);
          const cmp = user1.localeCompare(user2);
          console.log(cmp);
          if (cmp !== 0) {
            console.log(user1);
            console.log(user2);
            const transaction = new Transaction({
              amount: req.body.amount / membersArray.length,
              sender: mongoose.Types.ObjectId(req.body.userId),
              receiver: mongoose.Types.ObjectId(ele),
              group_id: groupDetails._id,
            });
            const saveTransaction = await transaction.save();
            console.log(saveTransaction);
          }
        });
        return res.status(200).send("Succesfully saved.");
      }
    );
    // res.status(200).end(saveBill);
  } else {
    res.status(500).end("Bill not added");
  }
});

module.exports = router;