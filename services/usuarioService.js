const UsuarioModel = require(`../models/usuarioModel`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);

const crear = async (body) => {
  const { email, contrasenia, nombre, apellido, telefono } = body;
  if (!email || !contrasenia || !nombre || !apellido || !telefono) {
    return {
      mensaje:
        "Error al registrar un nuevo usuarios. Todos los campos son obligatorios.",
    };
  }

  const usuarioExiste = await UsuarioModel.findOne({ email: email });
  if (usuarioExiste) {
    return {
      mensaje: "El email corresponde a un usuario ya registrado",
      statusCode: 400,
    };
  } else {
    const nuevoUsuario = new UsuarioModel({
      email,
      contrasenia,
      nombre,
      apellido,
      telefono,
    });

    try {
      const saltos = bcrypt.genSaltSync(10);
      nuevoUsuario.contrasenia = bcrypt.hashSync(
        nuevoUsuario.contrasenia,
        saltos
      );
      const usuarioRegistrado = await nuevoUsuario.save();
      return { usuarioRegistrado, statusCode: 201 };
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return {
        mensaje: "Error al registrar nuevo usuario (" + error + ")",
        statusCode: 400,
      };
    }
  }
};

const login = async (body) => {
  const usuario = await UsuarioModel.findOne({
    email: body.email,
  });
  if (!usuario) {
    return {
      mensajeError: "Error Usuario y/o contraseña incorrecto.",
    };
  }

  const verificarContrasenia = bcrypt.compareSync(
    body.contrasenia,
    usuario.contrasenia
  );

  if (verificarContrasenia) {
    const payload = {
      _id: usuario._id,
      rol: usuario.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return {
      mensaje: `Bienvenid@ ${usuario.nombre} ${usuario.apellido}`,
      token,
    };
  } else {
    return {
      mensajeError: "Error usuario y/o Contraseña incorrecto.",
    };
  }
};

const obtenerUsuarios = async () => {
  const usuarios = await UsuarioModel.find();
  if (!usuarios) {
    return {
      mensajeError: "Usuarios no encontradas",
    };
  } else {
    return usuarios;
  }
};

const obtenerUsuarioPorID = async (idUsuario) => {
  const usuario = await UsuarioModel.findById(idUsuario);

  if (usuario) {
    return usuario;
  } else {
    return { mensaje: "Usuario no encontrado" };
  }
};

const actualizar = async (idUsuario, body) => {
  if (!idUsuario) {
    return {
      mensajeError: "ID Incorrecto",
    };
  }

  const { email, nombre, apellido, telefono, bloqueado, rol } = body;
  const camposPermitidos = {};
  if (email !== undefined) camposPermitidos.email = email;
  if (nombre !== undefined) camposPermitidos.nombre = nombre;
  if (apellido !== undefined) camposPermitidos.apellido = apellido;
  if (telefono !== undefined) camposPermitidos.telefono = telefono;
  if (bloqueado !== undefined) camposPermitidos.bloqueado = bloqueado;
  if (rol !== undefined) camposPermitidos.rol = rol;

  if (Object.keys(camposPermitidos).length > 0) {
    const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
      idUsuario,
      body,
      { new: true }
    );
    if (!usuarioActualizado) {
      return {
        mensajeError: "Usuario no encontrado",
      };
    }
    return usuarioActualizado;
  } else {
    return {
      mensajeError: "Error al actualizar usuario",
    };
  }
};

const eliminar = async (idUsuario) => {
  const usuarioEliminado = await UsuarioModel.findByIdAndDelete({
    _id: idUsuario,
  });
  if (usuarioEliminado) {
    return { mensaje: "Usuario eliminado" };
  } else {
    return { mensajeError: "Usuario no encontrado" };
  }
};

module.exports = {
  crear,
  login,
  obtenerUsuarios,
  obtenerUsuarioPorID,
  actualizar,
  eliminar,
};
