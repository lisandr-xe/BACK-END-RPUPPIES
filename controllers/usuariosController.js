const UsuarioModel = require("../models/usuarioModel");
const usuarioService = require(`../services/usuarioService`);

//REGISTRO USUARIO
const registroUsuario = async (req, res) => {
    try{
        const resultado = await usuarioService.crear(req.body);
        if(resultado.mensaje){
            res.status(404).json(resultado.mensaje);
        }
        else{
            res.status(201).json(resultado);
        }
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

//LOGIN USUARIO
const loginUsuario = async (req, res) => {
    try{
        const resultado = await usuarioService.login(req.body);
        if(resultado.statusCode === 400){
            res.status(400).json(resultado);
        }
        else{
            res.status(200).json(resultado);
        }
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}


//GET DE TODOS
const obtenerTodosLosUsuarios = async (req, res) => {
    try{
        const usuarios = await usuarioService.obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

//GET USUARIO POR ID
const obtenerUsuario = async (req, res) => {
    try{
        resultado = await usuarioService.obtenerUsuarioPorID(req.params.idUsuario);
        if(resultado){
            res.status(200).json(resultado);
        }
        else {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}


//UPDATE USUARIO
const actualizarUsuario = async (req, res) => {
    try{
        const resultado = await usuarioService.actualizar(req.params.idUsuario, req.body);
        if(resultado.mensaje){
            res.status(404).json(resultado.mensaje);
        }
        else{
            res.status(200).json(resultado);
        }
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

//DELETE USUARIO
const eliminarUsuario = async (req, res) => {
    try{
        const resultado = await usuarioService.eliminar(req.params.idUsuario);
        if(resultado.mensaje){
            res.status(200).json(resultado.mensaje);
        }
        else{
            res.status(404).json(resultado.mensajeError);
        }
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    registroUsuario,
    loginUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
}