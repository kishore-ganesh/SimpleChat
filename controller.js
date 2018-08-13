const models = require("./models.js");
const Op = models.sequelize.Op;
var usermodel = models.usermodel;

// fix this

function returnMessages(from, to) {
  return new Promise((resolve, reject) => {
    todb = models.defineModel(to);
    todb.sync().then(() => {
      todb
        .findAll({
          where: {
            [Op.or]: {
              from: from,
              to: from
            } //All messages from from and to from
          }
        })
        .then(messages => {
          // console.log(messages);
          resolve(messages);
        });
    });
  });
}

function updateDB(db, from, to, message) {
  db.create({ from: from, to: to, messages: message });
}

function findUserinDB(username) {
  return new Promise((resolve, reject) => {
    usermodel
      .findAll({
        where: {
          username: username
        }
      })
      .then(user => {
        resolve(user);
      });
  });
}

function findUserbyID(id) {
  return usermodel.findAll({
    where: {
      id: id
    }
  });
}

function createUser(username, password) {
  usermodel.create({
    username: username,
    password: password
  });
}

module.exports = {
  returnMessages,
  updateDB,
  findUserbyID,
  findUserinDB,
  createUser
};
