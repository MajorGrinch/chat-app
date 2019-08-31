const users = []

// add a user
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // check for existing username
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if (existingUser) {
        return {
            error: 'Username already been taken for this room'
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return {user}
}

// remove a user
const removeUser = (id) => {
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

// get a user
const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

// get users in a room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => {
        return user.room === room
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}