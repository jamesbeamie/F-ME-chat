const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const userExists = users.find(
    user => user.name === name && user.room === room
  );
  if (userExists) {
    return { error: "username already taken" };
  }

  const user = { id, name, room };

  users.push(user);
  return { user };
};

const getUser = id => {
  const theUser = users.find(user => user.id === id);
  return theUser;
};

const removeUser = id => {
  const findUser = users.findIndex(user => user.id === id);

  if (findUser !== -1) {
    return users.splice(findUser, 1)[0];
  }
};

const getUsersInSpecificRoom = room => {
  const usersInRoom = users.filter(user => user.room === room);
  return usersInRoom;
};

module.exports = { addUser, removeUser, getUser, getUsersInSpecificRoom };
