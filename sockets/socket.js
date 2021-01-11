const { UsuariosLista } = require('../classes/usuarios-lista');
const { Usuario } = require('../classes/usuario');

const usuariosConectados = new UsuariosLista();

const conectarUsuario = (client) => {

    const usuario = new Usuario(client.id);
    usuariosConectados.agregarUsuario(usuario);

}

const disconnect = (client, io) => {

    client.on('disconnect', () => {
        const usuarioBorrado = usuariosConectados.borrarUsuario(client.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
        // console.log('Usuario desconectado: ', usuarioBorrado);
    });

}

// Esucuchar mensaje
const mensaje = (client, io) => {

    client.on('mensaje', (payload, callback) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });
}

// Esucuchar configuracion de usuario
const configurarUsuario = (client, io) => {

    client.on('configurar-usuario', (payload, callback) => {

        usuariosConectados.actualizarNombre(client.id, payload.nombre);
        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok: true,
            msj: `Usuario ${payload.nombre} configurado.`
        });

    });
}

// Obtener usuarios
const obtenerUsuarios = (client, io) => {

    client.on('obtener-usuarios', () => {

        io.to(client.id).emit('usuarios-activos', usuariosConectados.getLista());

    });
}

module.exports = {
    disconnect,
    mensaje,
    configurarUsuario,
    usuariosConectados,
    conectarUsuario,
    obtenerUsuarios
}