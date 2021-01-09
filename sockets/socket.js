const disconnect = (client) => {

    client.on('disconnect', () => {
        console.log('user disconnected');
    });

}

// Esucuchar mensaje
const mensaje = (client, io) => {

    client.on('mensaje', (payload, callback) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });

}

module.exports = {
    disconnect,
    mensaje
}