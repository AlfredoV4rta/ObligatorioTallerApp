let usuarioConectado = null;
let listaPaises = [];

class Usuario {
    constructor(usuario, password, pais) {
        this.usuario = usuario;
        this.password = password;
        this.pais = pais;
    }
}

class Evaluacion {
    constructor(objetivo, usuario, password, pais) {
        this.objetivo = objetivo;
        this.usuario = usuario;
        this.password = password;
        this.pais = pais;
    }
}

const Menu = document.querySelector("#menuPrincipal");
const Ruteo = document.querySelector("#ruteo");
const PantallaHome = document.querySelector("#pantallaHome");
const PantallaLogin = document.querySelector("#pantallaLogin");
const PantallaRegistrarUsuario = document.querySelector(
    "#pantallaRegistrarUsuario"
);
const PantallaRegistrarEvaluacion = document.querySelector(
    "#pantallaRegistrarEvaluacion"
);

inicio();

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
    document
        .querySelector("#btnRegistrarUsuario")
        .addEventListener("click", previaRegistrarUsuario);
    document.querySelector("#btnLogin").addEventListener("click", previaLogin);
    document
        .querySelector("#btnRegistrarEvaluacion")
        .addEventListener("click", previaRegistrarEvaluacion);
    document
        .querySelector("#btnMenuRegistrarEvaluacion")
        .addEventListener("click", obtenerObjetivos);
}

function ocultarPantalla() {
    PantallaHome.style.display = "none";
    PantallaLogin.style.display = "none";
    PantallaRegistrarUsuario.style.display = "none";
    PantallaRegistrarEvaluacion.style.display = "none";
}

function navegar(evento) {
    ocultarPantalla();
    if (evento.detail.to == "/") PantallaHome.style.display = "block";
    if (evento.detail.to == "/login") PantallaLogin.style.display = "block";
    if (evento.detail.to == "/registrarUsuario")
        PantallaRegistrarUsuario.style.display = "block";
    if (evento.detail.to == "/registrarEvaluacion")
        PantallaRegistrarEvaluacion.style.display = "block";
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

function previaRegistrarEvaluacion() {
    let objetivo = document.querySelector("#slcObjetivos").value;
    let calificacion = document.querySelector("#nCalificacion").value;
    let fecha = document.querySelector("#dtFecha").value;

    if (calificacion <= 5 && calificacion >= -5) {
        let nuevaEvaluacion = new Evaluacion(
            objetivo,
            localStorage.getItem("id"),
            calificacion,
            fecha
        );
        registrarEvaluacion(nuevaEvaluacion);
    } else {
        alert("La calificacion va desde -5 a 5");
    }

    obtenerObjetivos();
}

function previaRegistrarUsuario() {
    let usuario = document.querySelector("#txtUser").value;
    let password = document.querySelector("#txtPassword").value;
    let pais = document.querySelector("#slcPais").value;

    let nuevoUsuario = new Usuario(usuario, password, pais);
    registrarUsuario(nuevoUsuario);
}

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
            console.log(informacion)
            alert(informacion.mensaje)
            ocultarPantalla()
            PantallaHome.style.display = "block";
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
            console.log(informacion);
            if (informacion.codigo == "200") {
                alert("Registro creado con éxito");
                localStorage.setItem("token", informacion.token);
                localStorage.setItem("id", informacion.id);
                usuarioConectado = informacion.id;
                ocultarPantalla();
                PantallaHome.style.display = "block";
                mostrarMenuVIP();
            }
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
            token: localStorage.getItem("token"),
            iduser: localStorage.getItem("id"),
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

function previaLogin() {
    let usuario = document.querySelector("#txtUsuario").value;
    let password = document.querySelector("#txtPass").value;

    let nuevoLogin = new Object();
    nuevoLogin.usuario = usuario;
    nuevoLogin.password = password;
    hacerLogin(nuevoLogin);
}

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
                alert("Bienvenido");

                localStorage.setItem("token", informacion.token);
                localStorage.setItem("id", informacion.id);
                usuarioConectado = informacion.id;
                ocultarPantalla();
                PantallaHome.style.display = "block";
                mostrarMenuVIP();
            } else {
                alert("Login incorrecto");
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

document.addEventListener("DOMContentLoaded", (event) => {
    limitarFechaActual();
});
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
