const disconnect = (client) => {

    client.on('disconnect', () => {
        console.log('user disconnected');
    });

}

module.exports = {
    disconnect
}