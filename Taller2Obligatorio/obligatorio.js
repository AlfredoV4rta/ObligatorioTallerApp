//VARIABLES GLOBALES
let usuarioConectado = null;
let listaPaises = [];


//CLASES
class Usuario {
    constructor(usuario, password, pais) {
        this.usuario = usuario;
        this.password = password;
        this.pais = pais;
    }
}

class Evaluacion {
    constructor(objetivo, usuario, calificacion, fecha) {
        this.idObjetivo = objetivo;
        this.idUsuario = usuario;
        this.calificacion = calificacion;
        this.fecha = fecha;
    }
}


// VARIABLES PANTALLA
const Menu = document.querySelector("#menuPrincipal");
const Ruteo = document.querySelector("#ruteo");
const PantallaHome = document.querySelector("#pantallaHome");
const PantallaLogin = document.querySelector("#pantallaLogin");
const PantallaRegistrarUsuario = document.querySelector("#pantallaRegistrarUsuario");
const PantallaRegistrarEvaluacion = document.querySelector("#pantallaRegistrarEvaluacion");
const PantallaListado= document.querySelector("#pantallaListado")
const PantallaInforme = document.querySelector("#pantallaInforme")
const PantallaMapa = document.querySelector("#pantallaMapa")

inicio();


//FUNCION PRINCIPAL (INICIO)
function inicio() {
    ocultarTodoMenu();
    ocultarPantalla();
    obtenerPaises();

    PantallaHome.style.display = "none";
    if (localStorage.getItem("token") != null) {
        mostrarMenuVIP();
    } else {
        mostrarMenuBasico();
    }

    Ruteo.addEventListener("ionRouteDidChange", navegar);
    document.querySelector("#btnRegistrarUsuario").addEventListener("click", previaRegistrarUsuario);
    document.querySelector("#btnLogin").addEventListener("click", previaLogin);
    document.querySelector("#btnRegistrarEvaluacion").addEventListener("click", previaRegistrarEvaluacion);
    document.querySelector("#btnMenuRegistrarEvaluacion").addEventListener("click", obtenerObjetivos);
    document.querySelector("#btnMenuListaEvaluacion").addEventListener("click", previaListado);
    document.querySelector("#btnMenuInforme").addEventListener("click", obtenerEvaluacionesInfome);
    document.querySelector("#btnMenuMapa").addEventListener("click", obtenerUsuariosPorPais)
}


//FUNCIONES DE NAVEGACION
function ocultarPantalla() {
    PantallaHome.style.display = "none";
    PantallaLogin.style.display = "none";
    PantallaRegistrarUsuario.style.display = "none";
    PantallaRegistrarEvaluacion.style.display = "none";
    PantallaListado.style.display = "none";
    PantallaInforme.style.display = "none";
    PantallaMapa.style.display = "none"
}

function navegar(evento) {
    ocultarPantalla();
    if (evento.detail.to == "/") PantallaHome.style.display = "block";
    if (evento.detail.to == "/login") PantallaLogin.style.display = "block";
    if (evento.detail.to == "/registrarUsuario") PantallaRegistrarUsuario.style.display = "block";
    if (evento.detail.to == "/registrarEvaluacion"){
        if (localStorage.getItem("token") != null){
            PantallaRegistrarEvaluacion.style.display = "block";      
        } else {
            Ruteo.push("/login")
            PantallaLogin.style.display = "block"
        }  
    } 
    if (evento.detail.to == "/listaEvaluacion"){
        if (localStorage.getItem("token") != null){
            PantallaListado.style.display = "block";      
        } else {
            Ruteo.push("/login")
            PantallaLogin.style.display = "block"
        }  
    } 
    if (evento.detail.to == "/informe"){
        if (localStorage.getItem("token") != null){
            PantallaInforme.style.display = "block";      
        } else {
            Ruteo.push("/login")
            PantallaLogin.style.display = "block"
        }  
    } 
    if (evento.detail.to == "/mapa"){
        if (localStorage.getItem("token") != null){
            PantallaMapa.style.display = "block";      
        } else {
            Ruteo.push("/login")
            PantallaLogin.style.display = "block"
        }  
    } 
}

function cerrarMenu() {
    Menu.close();
}

function mostrarMenuBasico() {
    ocultarTodoMenu();
    document.querySelector("#btnMenuRegistrarUsuario").style.display = "block";
    document.querySelector("#btnMenuLogin").style.display = "block";
}

function mostrarMenuVIP() {
    ocultarTodoMenu();
    PantallaHome.style.display = "block";
    document.querySelector("#btnMenuRegistrarEvaluacion").style.display = "block";
    document.querySelector("#btnMenuListaEvaluacion").style.display = "block";
    document.querySelector("#btnMenuInforme").style.display = "block";
    document.querySelector("#btnMenuMapa").style.display = "block";
    document.querySelector("#btnMenuLogout").style.display = "block";
}

function ocultarTodoMenu() {
    document.querySelector("#btnMenuRegistrarUsuario").style.display = "none";
    document.querySelector("#btnMenuLogin").style.display = "none";
    document.querySelector("#btnMenuRegistrarEvaluacion").style.display = "none";
    document.querySelector("#btnMenuListaEvaluacion").style.display = "none";
    document.querySelector("#btnMenuInforme").style.display = "none";
    document.querySelector("#btnMenuMapa").style.display = "none";
    document.querySelector("#btnMenuLogout").style.display = "none";
}


//FUNCIONES PREVIAS
function previaRegistrarEvaluacion() {
    let objetivo = document.querySelector("#slcObjetivos").value;
    let calificacion = document.querySelector("#nCalificacion").value;
    let fecha = document.querySelector("#dtFecha").value;

    let validarCredenciales = credencialesValidasEva(objetivo, calificacion, fecha)

    if (validarCredenciales === "OK") {
        let nuevaEvaluacion = new Evaluacion(
            objetivo,
            localStorage.getItem("id"),
            calificacion,
            fecha
        );
        registrarEvaluacion(nuevaEvaluacion);
        console.log(nuevaEvaluacion)
    } else {
        mostrarMensaje(Error, "Credencial Incorrecta", `${validarCredenciales}`);
    }

    obtenerObjetivos();
}
function previaListado() {
    let idusuario = localStorage.getItem("id");
    let token = localStorage.getItem("token");
    let url = "https://goalify.develotion.com/evaluaciones.php?idUsuario=" + idusuario;

    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "iduser": idusuario 
        },
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (informacion) {
        console.log(informacion.evaluaciones)
        hacerListado(informacion.evaluaciones);
    })
    .catch(function(error){
        console.log(error)
    })
}

//HACER VALIDACIONES Y MOSTRAR MENSAJE
function previaRegistrarUsuario() {
    let usuario = document.querySelector("#txtUser").value;
    let password = document.querySelector("#txtPassword").value;
    let pais = document.querySelector("#slcPais").value;

    let validarCredenciales = credencialesValidasReg(usuario, password, pais)

    if (validarCredenciales === "OK") {
        let nuevoUsuario = new Usuario(usuario, password, pais);
        registrarUsuario(nuevoUsuario);
    } else {
        mostrarMensaje("WARNING", "Credencial Incorrecta", `${validarCredenciales}`)
    }
}

function previaLogin() {
    let usuario = document.querySelector("#txtUsuario").value;
    let password = document.querySelector("#txtPass").value;

    let nuevoLogin = new Object();
    nuevoLogin.usuario = usuario;
    nuevoLogin.password = password;
    hacerLogin(nuevoLogin);
}


//FUNCIONES REGISTROS (POST)
function registrarEvaluacion(nuevaEvaluacion) {
    fetch(`https://goalify.develotion.com/evaluaciones.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id"),
        },
        body: JSON.stringify(nuevaEvaluacion),
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (informacion) {
            mostrarMensaje("SUCCESS", "Registro hecho correctamente","")
            ocultarPantalla()
            Ruteo.push("/")
            PantallaHome.style.display = "block";
            limpiarCampos()
        })
        .catch(function (error) {
            console.log(error);
        });
}

function registrarUsuario(nuevoUsuario) {
    fetch(`https://goalify.develotion.com/usuarios.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo == "200") {
                mostrarMensaje("SUCCESS", "BIENVENIDO!", '')
                localStorage.setItem("token", informacion.token);
                localStorage.setItem("id", informacion.id);
                usuarioConectado = informacion.id;
                Ruteo.push("/");
                ocultarPantalla();
                PantallaHome.style.display = "block";
                mostrarMenuVIP();
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}


//FUNCIONES OBTENER (GET)
function obtenerEvaluacionesListado(){
    fetch("https://goalify.develotion.com/evaluaciones.php?idUsuario="+ localStorage.getItem("id"), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id"),
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (info) {
            console.log(info)
            hacerListado()
        })
        .catch(function (error) {
            console.log(error);
        });
}

function obtenerEvaluacionesInfome(){
    fetch("https://goalify.develotion.com/evaluaciones.php?idUsuario="+ localStorage.getItem("id"), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id"),
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (info) {
            hacerInforme(info)
        })
        .catch(function (error) {
            console.log(error);
        });
}

function obtenerPaises() {
    fetch("https://goalify.develotion.com/paises.php")
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {
            listaPaises = informacion.paises;
            console.log(informacion)
            cargarPaises();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function obtenerObjetivos() {
    ocultarPantalla()
    PantallaRegistrarEvaluacion.style.display = "block"
    fetch("https://goalify.develotion.com/objetivos.php", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id"),
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (info) {
            cargarObjetivos(info.objetivos);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function obtenerUsuariosPorPais(){
    PantallaMapa.style.display = "block"
    fetch("https://goalify.develotion.com/usuariosPorPais.php", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token"),
            "iduser": localStorage.getItem("id"),
        },
    })
        .then(function (response){
            return response.json();
        })
        .then(function(info) {
            console.log(info)
            cargarMapa(info)
        })
        .catch(function (error) {
            console.log(error);
        });
}


//FUNCIONES CARGAR SELECT
function cargarObjetivos(objetivos) {
    let miSelect = "";

    for (let unObjetivo of objetivos) {
        miSelect += `<ion-select-option value=${unObjetivo.id}>${unObjetivo.nombre}</ion-select-option>`;
    }

    document.querySelector("#slcObjetivos").innerHTML = miSelect;
}

function cargarPaises() {
    let miSelect = "";

    for (let unPais of listaPaises) {
        miSelect += `<ion-select-option value=${unPais.id}>${unPais.name}</ion-select-option>`;
    }
    document.querySelector("#slcPais").innerHTML = miSelect;
}


//FUNCION LOGUIN/LOGOUT
function hacerLogin(nuevoLogin) {
    fetch(`https://goalify.develotion.com/login.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoLogin),
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (informacion) {
            console.log(informacion);
            if (informacion.codigo == "200") {
                mostrarMensaje("SUCCESS", "Bienvenido")
                localStorage.setItem("token", informacion.token);
                localStorage.setItem("id", informacion.id);
                usuarioConectado = informacion.id;
                Ruteo.push("/");
                ocultarPantalla();
                PantallaHome.style.display = "block";
                mostrarMenuVIP();
            } else {
                mostrarMensaje("WARNING", "Credenciales Incorrectas");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    usuarioConectado = null;
    ocultarPantalla();
    mostrarMenuBasico();
    Ruteo.push("/login");
}

//FUNCIONES VALIDAR
function credencialesValidasEva(objetivo, calificacion, fecha){
    let mensaje = "OK"

    if (objetivo === undefined) {
        mensaje = "El objetivo no puede ser vacio"
    }
    if (calificacion > 5 || calificacion < -5 || calificacion === ''){
        mensaje = "La calificación debe ser un número entre -5 y 5"
    }
    if (fecha === undefined) {
        mensaje = "La fecha no puede estar vacia"
    }
    
    return mensaje
}

function credencialesValidasReg(usuario, contrasenia, pais) {
    let mensaje = "OK"

    if (usuario === "") {
        mensaje = "El usuario no puede estar vacío!"
    }
    if (contrasenia === "") {
        mensaje = "La contraseña no puede estar vacía!"
    }
    if (pais === undefined) {
        mensaje = "El país no puede estar vacío!"
    }

    return mensaje
}

//FUNCIONES ADICIONALES (COMPLETAR FUNCION LIMPIAR CAMPOS)
document.addEventListener("DOMContentLoaded", (event) => {limitarFechaActual();});
function limitarFechaActual() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = ("0" + (hoy.getMonth() + 1)).slice(-2);
    const dia = ("0" + hoy.getDate()).slice(-2);
    const horas = ("0" + hoy.getHours()).slice(-2);
    const minutos = ("0" + hoy.getMinutes()).slice(-2);
    const segundos = ("0" + hoy.getSeconds()).slice(-2);
    const fechaMaxima = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
    document.querySelector("#dtFecha").setAttribute("max", fechaMaxima);
}

function mostrarMensaje(tipo, titulo, texto, duracion) {
const toast = document.createElement('ion-toast');
toast.header = titulo;
toast.message = texto;
if (!duracion) {
duracion = 2000;
}
toast.duration = duracion;
if (tipo === "ERROR") {
toast.color = 'danger';
toast.icon = "alert-circle-outline";
} else if (tipo === "WARNING") {
toast.color = 'warning';
toast.icon = "warning-outline";
} else if (tipo === "SUCCESS") {
toast.color = 'success';
toast.icon = "checkmark-circle-outline";
}
document.body.appendChild(toast);
toast.present();
}

function hacerInforme(listadoEva) {
    //Puntaje Global
    let totalEva= listadoEva.evaluaciones.length
    let totalCalificacionesEva= 0
    for (let unaEva of listadoEva.evaluaciones) {
        totalCalificacionesEva += unaEva.calificacion
    }

    let promedio = totalCalificacionesEva/totalEva
    document.querySelector("#PuntajeGlobal").innerHTML = promedio.toFixed(2)

    //Puntaje Diario
    let totalEvaHoy= 0
    let totalCalificacionesEvaHoy= 0
    for (let unaEva of listadoEva.evaluaciones) {
        if (evaluacionDeHoy(unaEva)) {
            totalEvaHoy++
            totalCalificacionesEvaHoy += unaEva.calificacion
        }
    }
    let promedioHoy = 0 
    if (totalEvaHoy != 0) {
        promedioHoy = totalCalificacionesEvaHoy/totalEvaHoy
    }
    
    document.querySelector("#PuntajeDiario").innerHTML= promedioHoy.toFixed(2)
}

function evaluacionDeHoy(unaEva){
    let hoy = new Date()
    const partesFecha = unaEva.fecha.split("T")[0].split("-");
    const fechaEva = new Date(
        parseInt(partesFecha[0]),           // año
        parseInt(partesFecha[1]) - 1,       // mes (0-indexado)
        parseInt(partesFecha[2])            // día
    );
    let esDeHoy = false

    if (fechaEva.getDate() === hoy.getDate() && fechaEva.getMonth() === hoy.getMonth() && fechaEva.getFullYear() === hoy.getFullYear()) {
        esDeHoy = true
    }

    return esDeHoy
}
function limpiarCampos() {
    document.querySelector("#slcObjetivos").value = 0
    document.querySelector("#nCalificacion").value = ''
}

function cargarMapa(info){
    var map = L.map('map').setView([-33, -56], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
for (let unPais of listaPaises) {
       marker = L.marker([unPais.latitude, unPais.longitude]).addTo(map);
       for (let unPaisxUsuario of info.paises) {
        if(unPais.name == unPaisxUsuario.nombre){
            marker.bindPopup(`<b>${unPais.name}</b><br>${unPaisxUsuario.cantidadDeUsuarios}`).openPopup();
        }
       }
    }
}

function hacerListado(evaluaciones) {
    let verEvaluacion = ``;
    for (let unaE of evaluaciones) {
    verEvaluacion += `<ion-item>
                    <ion-label>
                    <h3>Id: ${unaE.id}</h3>
                    <h3>Fecha: ${unaE.fecha}</h3>
                    <h3>Objetivo: ${unaE.idObjetivo}</h3>
                    <h3>Calificación: ${unaE.calificacion}</h3>
                    </ion-label>
                    <ion-button onclick="eliminarEvaluacion(${unaE.id})">Eliminar</ion-button>
                </ion-item>`
    }

    document.querySelector("#contenedorListado").innerHTML = verEvaluacion;
}

function eliminarEvaluacion(idEvaluacion){
    let idusuario = localStorage.getItem("id");
    let token = localStorage.getItem("token");
    let url = "https://goalify.develotion.com/evaluaciones.php?idEvaluacion=" + idEvaluacion;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "token": token,
            "iduser": idusuario 
        },
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (informacion) {
        if (informacion.codigo == 200){
            mostrarMensaje ("SUCCESS", informacion.mensaje, "")
            previaListado()
        } else {
            mostrarMensaje ("WARNING", informacion.mensaje, "")
        }
    })
    .catch(function(error){
        console.log(error)
    })
}