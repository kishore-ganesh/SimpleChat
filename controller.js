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
            [Op.or]: [
              {
                [Op.and]: [
                  {
                    from: from,
                    to: to
                  }
                ]
              },

              {
                [Op.and]: [
                  {
                    from: to,
                    to: from
                  }
                ]
              }
            ] //All messages from from and to from
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

function createGroup(group) {
  let groupdb = models.defineGroup();
  groupdb.sync().then(() => {
    groupdb.create({
      groupname: group.name,
      members: JSON.stringify(group.members)
    });
  });
}

function addUserToGroup(groupname, username) {
  let groupdb = models.defineGroup();
  groupdb.sync.then(() => {
    groupdb
      .findOne({
        where: {
          groupname: groupname
        }
      })
      .then(group => {
        let members = JSON.parse(group.members);
        if (members.find(username) == undefined) {
          groupdb.update({
            where: {
              groupname: groupname
            },
            values: {
              members: JSON.stringify([...members, username])
            }
          });
        }
      });
  });
}

function fetchMessagesFromGroup(groupname) {
  return new Promise((resolve, reject) => {
    let groupdb = models.defineGroup();
    groupdb.sync().then(() => {
      resolve(
        groupdb.findAll({
          where: {
            groupname: groupname
          }
        })
      );
    });
  });
}

function addGroupMessage(groupname, message) {
  let groupdb = models.defineMessagesForGroup(groupname);
  groupdb.sync().then(() => {
    groupdb.create({
      message: message.data,
      from: message.from
    });
  });
}

function getUserList() {
  // console.log(users.length);
  return models.users;
  //make this more efficient
}

function addToUserList(username) {
  models.users.push(username);
}

function deleteFromUserList(username) {
  models.users.splice(users.indexOf(username), 1);
}

function getAllUsers(username) {
  return new Promise((resolve, reject) => {
    var userslist = [];
    usermodel.findAll({ attributes: ["username"] }).then(list => {
      list.forEach(listitem => {
        userslist.push({ name: listitem.username, type: "user" });
      });

      let groupmodel = models.defineGroup();
      groupmodel.sync().then(() => {
        groupmodel.findAll({}).then(groups => {
          console.log("GROUPS: "+groups);
          groups.forEach(group => {
            if (username) {
              let members = JSON.parse(group.members);
              if (members.find((member)=>{
                return member == username;
              })) {
                userslist.push({ name: group.groupname, type: "group" }); //Add requisite data here?
              }
            }
          });
          resolve(userslist);
        });
      });
    });
  });
}

module.exports = {
  returnMessages,
  updateDB,
  findUserbyID,
  findUserinDB,
  createUser,
  getUserList,
  addToUserList,
  deleteFromUserList,
  getAllUsers,
  createGroup,
  addUserToGroup,
  addGroupMessage,
  fetchMessagesFromGroup
};
