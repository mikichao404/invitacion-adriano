// 1. CONFIGURACIÓN
let nombreInvitado = "";
const linkGoogleForms = "https://docs.google.com/forms/d/e/1FAIpQLSfan9uaFiBPQKLPowz-_G4lZPFZil9uXsCPdLz3LQuZNdelHg/viewform?usp=header"; 

// 2. EMPEZAR JUEGO
window.empezarJuego = function() {
    const input = document.getElementById('userName');
    nombreInvitado = input.value.trim();

    if (nombreInvitado === "") {
        alert("¡Por favor, escribe tu nombre!");
        return;
    }

    document.getElementById('welcome-screen').style.display = "none";
    document.getElementById('game-container').style.display = "block";
    
    crearTablero();
};

// 3. TABLERO
function crearTablero() {
    const grid = document.getElementById('grid');
    const totalBlocks = 16;
    const hiddenIndex = Math.floor(Math.random() * totalBlocks); 

    for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.innerText = "💣";

        block.onclick = function() {
            if (i === hiddenIndex) {
                // CUANDO ENCUENTRA LA TORTA
                this.style.background = "gold";
                this.innerText = "🎂";
                this.style.transform = "scale(1.3)";
                
                // Pasamos directo a la invitación tras medio segundo
                setTimeout(mostrarInvitacion, 600); 
            } else {
                // BOMBA FALSA
                this.classList.add('boom');
                this.innerText = "🔥";
                this.style.pointerEvents = "none";
                setTimeout(() => { this.style.visibility = 'hidden'; }, 400);
            }
        };
        grid.appendChild(block);
    }
}

// 4. INVITACIÓN FINAL (Personalizada con Nombre y Formulario)
function mostrarInvitacion() {
    const container = document.getElementById('game-container');
    document.body.style.backgroundColor = "rgba(0,0,0,0.9)";
    document.body.style.backgroundImage = "none"; 

    container.innerHTML = `
        <div style="background: white; color: #333; padding: 25px; border-radius: 20px; border: 6px solid #e67e22; max-width: 300px; margin: auto; font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #e67e22; margin: 0;">¡MISIÓN CUMPLIDA!</h2>
            <h3 style="color: #2c3e50; margin: 10px 0;">¡Hola ${nombreInvitado}!</h3>
            <p>Estás invitado a mi fiesta:</p>
            <div style="font-size: 50px; margin: 10px 0;">🎂</div>
            <hr style="border: 1px dashed #e67e22;">
            <h3 style="margin: 10px 0;">FIESTA DE ADRIANO</h3>
            <p style="font-size: 14px;">📍 Pesquero II | 📅 01/04/26 | 🕐 5:00 PM</p>
            
           <button onclick="window.open('${linkGoogleForms}', '_blank')" style="background: #27ae60; color: white; padding: 15px; border: none; border-radius: 10px; width: 100%; font-weight: bold; cursor: pointer; margin-top: 10px; font-size: 16px;">✅ CONFIRMAR ASISTENCIA</button>
            
            <button onclick="location.reload()" style="background: #eee; color: #666; padding: 8px; border: none; border-radius: 8px; width: 100%; cursor: pointer; margin-top: 15px; font-size: 12px;">🎮 VOLVER A JUGAR</button>
        </div>
    `;
}



