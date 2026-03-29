let nombreInvitado = "";
const linkGoogleForms = "https://docs.google.com/forms/d/e/1FAIpQLSfan9uaFiBPQKLPowz-_G4lZPFZil9uXsCPdLz3LQuZNdelHg/viewform?usp=header";

const bgMusic = document.getElementById("bgMusic");
const bombSound = document.getElementById("bombSound");
const cakeSound = document.getElementById("cakeSound");

let vidas = 6;
let intentos = 0;
let tiempo = 0;
let timer = null;
let juegoActivo = false;

const TOTAL_BLOCKS = 16;
const RANKING_KEY = "rankingBombermanInvitacion";

window.addEventListener("load", () => {
    mostrarRankingInicio();
});

window.empezarJuego = function () {
    const input = document.getElementById("userName");
    nombreInvitado = input.value.trim();

    if (nombreInvitado === "") {
        alert("¡Por favor, escribe tu nombre!");
        return;
    }

    vidas = 16;
    intentos = 0;
    tiempo = 0;
    juegoActivo = true;

    document.getElementById("vidas").textContent = vidas;
    document.getElementById("intentos").textContent = intentos;
    document.getElementById("tiempo").textContent = tiempo;

    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";

    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {
        console.log("El navegador bloqueó la reproducción automática.");
    });

    iniciarTemporizador();
    crearTablero();
};

function iniciarTemporizador() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (!juegoActivo) return;
        tiempo++;
        document.getElementById("tiempo").textContent = tiempo;
    }, 1000);
}

function detenerTemporizador() {
    clearInterval(timer);
}

function crearTablero() {
    const grid = document.getElementById("grid");
    const hiddenIndex = Math.floor(Math.random() * TOTAL_BLOCKS);

    grid.innerHTML = "";

    for (let i = 0; i < TOTAL_BLOCKS; i++) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.innerText = "💣";

        block.onclick = function () {
            if (!juegoActivo) return;
            if (this.classList.contains("bloque-deshabilitado")) return;

            intentos++;
            document.getElementById("intentos").textContent = intentos;

            if (i === hiddenIndex) {
                juegoActivo = false;
                this.style.background = "gold";
                this.innerText = "🎂";
                this.style.transform = "scale(1.2)";

                cakeSound.currentTime = 0;
                cakeSound.play();

                detenerTemporizador();
                guardarRanking(nombreInvitado, tiempo, intentos);

                setTimeout(() => {
                    mostrarInvitacion();
                }, 900);
            } else {
                vidas--;
                document.getElementById("vidas").textContent = vidas;

                this.classList.add("boom", "bloque-deshabilitado");
                this.innerText = "🔥";

                bombSound.currentTime = 0;
                bombSound.play();

                setTimeout(() => {
                    this.style.visibility = "hidden";
                }, 350);

                if (vidas <= 0) {
                    juegoActivo = false;
                    detenerTemporizador();

                    setTimeout(() => {
                        mostrarGameOver();
                    }, 500);
                }
            }
        };

        grid.appendChild(block);
    }
}

function generarConfeti(cantidad) {
    let confetiHTML = "";
    const emojis = ["🎉", "✨", "🎊", "💣", "🎂"];

    for (let i = 0; i < cantidad; i++) {
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 3;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        confetiHTML += `
            <span class="confeti" style="left:${left}%; animation-delay:${delay}s; animation-duration:${duration}s;">
                ${emoji}
            </span>
        `;
    }

    return confetiHTML;
}

function guardarRanking(nombre, tiempoJugador, intentosJugador) {
    const ranking = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];

    ranking.push({
        nombre: nombre,
        tiempo: tiempoJugador,
        intentos: intentosJugador
    });

    ranking.sort((a, b) => {
        if (a.tiempo !== b.tiempo) return a.tiempo - b.tiempo;
        return a.intentos - b.intentos;
    });

    const top10 = ranking.slice(0, 10);
    localStorage.setItem(RANKING_KEY, JSON.stringify(top10));
}

function obtenerRanking() {
    return JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
}

function renderRankingHTML() {
    const ranking = obtenerRanking();

    if (ranking.length === 0) {
        return `<p>Aún no hay jugadores registrados.</p>`;
    }

    let html = `<ol class="ranking-lista">`;

    ranking.forEach((jugador) => {
        html += `<li><strong>${jugador.nombre}</strong> - ${jugador.tiempo}s - ${jugador.intentos} intentos</li>`;
    });

    html += `</ol>`;
    return html;
}

function mostrarRankingInicio() {
    const rankingList = document.getElementById("ranking-list");
    if (rankingList) {
        rankingList.innerHTML = renderRankingHTML();
    }
}

function mostrarInvitacion() {
    bgMusic.pause();
    bgMusic.currentTime = 0;

    const container = document.getElementById("game-container");

    container.innerHTML = `
        <div class="card-invitacion">
            <div class="decoracion decoracion1">💣</div>
            <div class="decoracion decoracion2">🎮</div>
            <div class="decoracion decoracion3">🎂</div>
            <div class="decoracion decoracion4">🎉</div>

            <h2>¡MISIÓN CUMPLIDA!</h2>
            <h3>¡Hola ${nombreInvitado}!</h3>
            <p>Estás invitado a mi fiesta de cumpleaños:</p>

            <div class="cake-icon">🎂</div>

            <hr>

            <h3>FIESTA DE "ADRIANO"</h3>
            <p class="detalle-fiesta">📍 Pesquero II</p>
            <p class="detalle-fiesta">📅 1 de abril de 2026</p>
            <p class="detalle-fiesta">🕔 5:30 PM</p> 
            <p class="mensaje-final">⏱️ Terminaste en ${tiempo} segundos y con ${intentos} intentos</p>
            <p>👉 Confirma tu asistencia aquí 👇</p>
            <button onclick="window.open('${linkGoogleForms}', '_blank')" class="btn-confirmar">
                ✅ CONFIRMAR ASISTENCIA
            </button>

            <button onclick="location.reload()" class="btn-jugar">
                🎮 VOLVER A JUGAR
            </button>

            <div class="ranking-box">
                <h3>🏆 TOP 10</h3>
                ${renderRankingHTML()}
            </div>

            <div class="confeti-container">
                ${generarConfeti(25)}
            </div>

            <button onclick="limpiarRanking()">🗑️ Limpiar ranking</button>
        </div>
    `;
}
function limpiarRanking() {
    localStorage.removeItem("rankingBombermanInvitacion");
    location.reload();
}

function mostrarGameOver() {
    bgMusic.pause();
    bgMusic.currentTime = 0;

    const container = document.getElementById("game-container");

    container.innerHTML = `
        <div class="game-over">
            <h2>💥 GAME OVER 💥</h2>
            <p>Te quedaste sin vidas, ${nombreInvitado}.</p>
            <p>Lo intentaste <strong>${intentos}</strong> veces.</p>
            <p>Duraste <strong>${tiempo}</strong> segundos.</p>

            <button onclick="location.reload()" class="btn-reiniciar">
                🔄 INTENTAR DE NUEVO
            </button>

            <div class="ranking-box">
                <h3>🏆 TOP 10</h3>
                ${renderRankingHTML()}
            </div>
        </div>
    `;
}



