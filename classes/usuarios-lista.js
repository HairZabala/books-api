class UsuariosLista {

    lista = [];

    constructor() {}

    agregarUsuario(usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }

    // Actualizar nombre de usuario
    actualizarNombre(id, nombre) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;
            }
        }

        console.log('======= Actualizando usuario =======');
        console.log(this.lista);
    }

    // Obtener todos los usuarios conectados
    getLista() {
        return this.lista;
    }

    // Obtener un usuario.
    getUsuario(id) {
        return this.lista.filter(usuario => usuario.id === id);
    }

    // Obtener usuario en una sala.
    getUsuariosEnSale(sala) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }

    // Borrar un usuario
    borrarUsuario(id) {

        const permUsuario = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        return permUsuario;
    }

}

module.exports = {
    UsuariosLista
}