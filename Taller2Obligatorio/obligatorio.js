let usuarioConectado = null
let listaPaises=[]

class Usuario{
    constructor(usuario, password, pais){
    this.usuario = usuario 
    this.password = password 
    this.pais = pais
    }
}

const Menu = document.querySelector("#menuPrincipal")
const Ruteo = document.querySelector("#ruteo")
const PantallaHome = document.querySelector("#pantallaHome")
const PantallaLogin = document.querySelector("#pantallaLogin")
const PantallaRegistrarUsuario = document.querySelector("#pantallaRegistrarUsuario")

inicio()

function inicio(){
    ocultarTodoMenu()
    ocultarPantalla()
    obtenerPaises()
    PantallaHome.style.display="none"
        if (localStorage.getItem("token")!=null){
         mostrarMenuVIP()
        } else {
          mostrarMenuBasico()
        }

   
    Ruteo.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnRegistrarUsuario").addEventListener("click", previaRegistrarUsuario)
    document.querySelector("#btnLogin").addEventListener("click", previaLogin)
   
}

function ocultarPantalla(){
    PantallaHome.style.display="none"
    PantallaLogin.style.display="none"
    PantallaRegistrarUsuario.style.display="none"
}

function navegar(evento){
    ocultarPantalla()
    if(evento.detail.to=="/") PantallaHome.style.display="block"
    if(evento.detail.to=="/login") PantallaLogin.style.display="block"
    if(evento.detail.to=="/registrarUsuario") PantallaRegistrarUsuario.style.display="block"

}

function cerrarMenu(){
    Menu.close()
}

function mostrarMenuBasico(){
      ocultarTodoMenu()
        document.querySelector("#btnMenuRegistrarUsuario").style.display="block"
        document.querySelector("#btnMenuLogin").style.display="block"

}

function mostrarMenuVIP(){
      ocultarTodoMenu()
    document.querySelector("#btnMenuRegistrarEvaluacion").style.display="block"
    document.querySelector("#btnMenuListaEvaluacion").style.display="block"
    document.querySelector("#btnMenuInforme").style.display="block"
    document.querySelector("#btnMenuMapa").style.display="block"
    document.querySelector("#btnMenuLogout").style.display="block"
        
}

function ocultarTodoMenu(){
    document.querySelector("#btnMenuRegistrarUsuario").style.display="none"
    document.querySelector("#btnMenuLogin").style.display="none"
    document.querySelector("#btnMenuRegistrarEvaluacion").style.display="none"
    document.querySelector("#btnMenuListaEvaluacion").style.display="none"
    document.querySelector("#btnMenuInforme").style.display="none"
    document.querySelector("#btnMenuMapa").style.display="none"
    document.querySelector("#btnMenuLogout").style.display = "none"
    
   
}
function previaRegistrarUsuario(){
    let usuario= document.querySelector("#txtUser").value
    let password= document.querySelector("#txtPassword").value
    let pais= document.querySelector("#slcPais").value

    let nuevoUsuario= new Usuario(usuario, password, pais)
    hacerRegistro(nuevoUsuario) 
}

function hacerRegistro(nuevoUsuario){
    fetch (`https://goalify.develotion.com/usuarios.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
    },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(function (response){
            console.log(response)
            return response.json()
        })
        .then(function(informacion){
            console.log(informacion)
            if (informacion.codigo=="200"){
                alert ("Registro creado con éxito")
                
                ocultarPantalla()
                PantallaLogin.style.display="block"
                mostrarMenuBasico()
            }
            
        })
        .catch(function(error){
            console.log(error)
        })

}

function obtenerPaises(){
     fetch("https://goalify.develotion.com/paises.php")
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){ 
          listaPaises= informacion.paises
          cargarPaises()
        })
        .catch(function(error){
        console.log(error)
        })
}

function cargarPaises(){
    console.log(listaPaises)
    let miSelect=""

    for (let unPais of listaPaises){
        miSelect+=`<ion-select-option value=${unPais.id}>${unPais.name}</ion-select-option>`
    }
    document.querySelector("#slcPais").innerHTML=miSelect
}

function previaLogin(){
    let usuario= document.querySelector("#txtUsuario").value  
    let password= document.querySelector("#txtPass").value  

    let nuevoLogin= new Object()
    nuevoLogin.usuario=usuario 
    nuevoLogin.password=password 
    hacerLogin(nuevoLogin)
}

function hacerLogin(nuevoLogin){
  fetch (`https://goalify.develotion.com/login.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
    },
        body: JSON.stringify(nuevoLogin)
    })
        .then(function (response){
            console.log(response)
            return response.json()
        })
        .then(function(informacion){
            console.log(informacion)
            if (informacion.codigo=="200"){
                alert ("Bienvenido")
                
                localStorage.setItem("token",informacion.token)
                localStorage.setItem("id",informacion.id)
                usuarioConectado=  informacion.id
                ocultarPantalla()
                PantallaHome.style.display="block"
                mostrarMenuVIP()
            } else {
            alert("Login incorrecto");
         }
            
        })
        .catch(function(error){
            console.log(error)
        })

}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    usuarioConectado = null;
    ocultarPantalla();
    mostrarMenuBasico();
    Ruteo.push("/login");
}