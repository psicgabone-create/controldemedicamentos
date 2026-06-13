let datos = JSON.parse(
    localStorage.getItem("medicamentoActual")
);

let alarmaDisparada = false;
let audioActual = null;

// Permiso para reproducir audio
let audioPermitido = false;

document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("activarAudio");

    if(boton){

        boton.addEventListener("click", async () => {

            try {

                const audio = new Audio("tomar_medicamentos.mp3");

                await audio.play();

                audio.pause();
                audio.currentTime = 0;

                audioPermitido = true;

                boton.style.display = "none";

                alert("✅ Alarmas activadas");

            } catch(error) {

                console.error(error);

                alert("❌ No se pudo activar el audio");

            }

        });

    }

});

function reproducirAlarma(){

    if(!audioPermitido){

        alert("⚠ Primero presiona 'Activar Alarmas'");

        return;
    }

    audioActual = new Audio("tomar_medicamentos.mp3");

    audioActual.loop = true;
    audioActual.volume = 1;

    audioActual.play()
    .then(() => {

        console.log("Alarma reproduciéndose");

    })
    .catch(error => {

        console.error(
            "Error al reproducir:",
            error
        );

    });
}

function verificarHora(){

    if(!datos){

        console.log(
            "No hay medicamento guardado"
        );

        return;
    }

    let ahora = new Date();

    let horaActual =
        ahora.getHours().toString().padStart(2,'0')
        + ":" +
        ahora.getMinutes().toString().padStart(2,'0');

    if(
        horaActual === datos.hora &&
        !alarmaDisparada
    ){

        alarmaDisparada = true;

        document.body.style.backgroundImage =
        `url('${datos.imagen}')`;

        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        document.getElementById("espera")
        .style.display = "none";

        document.getElementById("contenedor")
        .style.display = "block";

        document.getElementById("nombre")
        .innerHTML =
        "💊 " + datos.nombre;

        document.getElementById("dosis")
        .innerHTML =
        "💉 Dosis: " + datos.dosis;

        document.getElementById("hora")
        .innerHTML =
        "⏰ Hora: " + datos.hora;

        alert(
            "⏰ Es hora de tomar " +
            datos.nombre
        );

        reproducirAlarma();
    }
}

function detenerAlarma(){

    if(audioActual){

        audioActual.pause();
        audioActual.currentTime = 0;

    }

    window.location.href =
    "index.html";
}

verificarHora();

setInterval(
    verificarHora,
    1000
);