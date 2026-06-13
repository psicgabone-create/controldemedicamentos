let datos = JSON.parse(localStorage.getItem("medicamentoActual"));

let alarmaDisparada = false;
let audioPermitido = false;
let audioActual = null;

// ===============================
// ACTIVAR AUDIO (OBLIGATORIO iPhone)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("activarAudio");

    if (boton) {

        boton.addEventListener("click", async () => {

            try {

                // Crear audio UNA SOLA VEZ
                audioActual = new Audio("tomar_medicamentos.mp3");
                audioActual.preload = "auto";
                audioActual.loop = true;
                audioActual.volume = 1;

                // Truco iOS: forzar permiso de reproducción
                await audioActual.play();
                audioActual.pause();
                audioActual.currentTime = 0;

                audioPermitido = true;

                boton.style.display = "none";

                alert("✅ Alarmas activadas");

                // Permiso notificaciones (opcional pero recomendado)
                if ("Notification" in window) {
                    Notification.requestPermission();
                }

            } catch (error) {

                console.error(error);
                alert("❌ iPhone bloqueó el audio. Toca nuevamente el botón.");

            }

        });

    }

});


// ===============================
// REPRODUCIR ALARMA
// ===============================
function reproducirAlarma() {

    if (!audioPermitido || !audioActual) {
        console.log("Audio no activado");
        return;
    }

    audioActual.currentTime = 0;

    audioActual.play()
        .then(() => {
            console.log("🔊 Alarma sonando");
        })
        .catch(err => {
            console.error("Error audio iPhone:", err);
        });

    // Vibración Android (iPhone limitado)
    if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000]);
    }

    // Notificación respaldo
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("💊 Hora del medicamento", {
            body: datos.nombre
        });
    }
}


// ===============================
// VERIFICAR HORA
// ===============================
function verificarHora() {

    if (!datos) {
        console.log("No hay medicamento guardado");
        return;
    }

    let ahora = new Date();

    let horaActual =
        ahora.getHours().toString().padStart(2, '0') +
        ":" +
        ahora.getMinutes().toString().padStart(2, '0');

    if (
        horaActual === datos.hora &&
        !alarmaDisparada
    ) {

        alarmaDisparada = true;

        // UI
        document.body.style.backgroundImage = `url('${datos.imagen}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        document.getElementById("espera").style.display = "none";
        document.getElementById("contenedor").style.display = "block";

        document.getElementById("nombre").innerHTML = "💊 " + datos.nombre;
        document.getElementById("dosis").innerHTML = "💉 Dosis: " + datos.dosis;
        document.getElementById("hora").innerHTML = "⏰ Hora: " + datos.hora;

        alert("⏰ Es hora de tomar " + datos.nombre);

        reproducirAlarma();
    }
}


// ===============================
// DETENER ALARMA
// ===============================
function detenerAlarma() {

    if (audioActual) {
        audioActual.pause();
        audioActual.currentTime = 0;
    }

    window.location.href = "index.html";
}


// ===============================
// INICIAR LOOP
// ===============================
verificarHora();
setInterval(verificarHora, 1000);