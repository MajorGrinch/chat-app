const socket = io()

const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('#submitMessageBtn')
const $shareLocationButton = document.querySelector('#shareLocationBtn')
const $messageContainer = document.querySelector('#message-container')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // new message element
    const $newMessage = $messageContainer.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // console.log(newMessageMargin)

    // visble height
    const visbleHeight = $messageContainer.offsetHeight

    // height of messages container
    const containerHeight = $messageContainer.scrollHeight

    // How far have I scrolled
    const scrollOffset = $messageContainer.scrollTop + visbleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messageContainer.scrollTop = $messageContainer.scrollHeight
    }
}

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        messageContent: msg.text,
        createdAt: moment(msg.createdAt).format('hh:mm a')
    })
    $messageContainer.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (locationMessage) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: locationMessage.username,
        locationUrl: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('hh:mm a')
    })
    $messageContainer.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, userList}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        userList
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.messageInput.value
    socket.emit('clientSendRoomMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$shareLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }


    navigator.geolocation.getCurrentPosition((position) => {
        $shareLocationButton.setAttribute('disabled', 'disabled')
        socket.emit('shareLocation',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
        }, ()=>{
            console.log('Location shared!')
            $shareLocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})