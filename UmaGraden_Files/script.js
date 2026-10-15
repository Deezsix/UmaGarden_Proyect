/* ========================================
   MODALES DE PERSONAJES
======================================== */

function abrirModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("activo");
    }

}


function cerrarModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("activo");
    }

}


/* ========================================
   MEMORAMA DE UMAS
======================================== */

const umasMemorama = [

    {
        nombre: "Haru Urara",
        imagen: "/characters/haru-game.png"
    },

    {
        nombre: "Special Week",
        imagen: "/characters/special-game.png"
    },

    {
        nombre: "Agnes Tachyon",
        imagen: "/characters/agnes-game.png"
    },

    {
        nombre: "Tamamo Cross",
        imagen: "/characters/tamamo-game.png"
    },

    {
        nombre: "Gold Ship",
        imagen: "/characters/goldship-game.png"
    },

    {
        nombre: "El Condor Pasa",
        imagen: "/characters/condor-game.png"
    }

];


let primeraCarta = null;
let segundaCarta = null;

let bloquearTablero = false;

let movimientos = 0;


/* ========================================
   🎯 ATRAPA A LAS UMAS
======================================== */

const personajesAtrapa = [
  {
    nombre: "Mihono Bourbon",
    imagen: "/characters/bourbon-dance.gif"
  },
  {
    nombre: "Super Creek",
    imagen: "/characters/creek-dance.gif"
  },
  {
    nombre: "Aston Machan",
    imagen: "/characters/machan-dance.gif"
  },
  {
    nombre: "Gold Ship",
    imagen: "/characters/goldship-dance.gif"
  }
];

const configuracionAtrapa = {
  facil: { duracion: 45, aparicion: 1800 },
  medio: { duracion: 40, aparicion: 1200 },
  dificil: { duracion: 30, aparicion: 700 }
};

let puntosAtrapa = 0;
let tiempoRestanteAtrapa = 45;
let intervaloTiempoAtrapa = null;
let temporizadorUmaAtrapa = null;
let partidaAtrapaActiva = false;

function leerRecordAtrapa() {
  try {
    return Number(localStorage.getItem("recordUmaGardenAtrapa")) || 0;
  } catch {
    return 0;
  }
}

function guardarRecordAtrapa(puntos) {
  try {
    localStorage.setItem("recordUmaGardenAtrapa", String(puntos));
  } catch {
    // El juego continúa aunque el almacenamiento no esté disponible.
  }
}

function actualizarMarcadorAtrapa() {
  document.getElementById("puntosAtrapa").textContent = puntosAtrapa;
  document.getElementById("tiempoAtrapa").textContent =
    tiempoRestanteAtrapa;
  document.getElementById("recordAtrapa").textContent =
    leerRecordAtrapa();
}

function limpiarTemporizadoresAtrapa() {
  clearInterval(intervaloTiempoAtrapa);
  clearTimeout(temporizadorUmaAtrapa);
  intervaloTiempoAtrapa = null;
  temporizadorUmaAtrapa = null;
}

function iniciarAtrapa() {
  limpiarTemporizadoresAtrapa();

  const nivel = document.getElementById("nivelAtrapa").value;
  const config = configuracionAtrapa[nivel];
  const jardin = document.getElementById("jardinAtrapa");

  puntosAtrapa = 0;
  tiempoRestanteAtrapa = config.duracion;
  partidaAtrapaActiva = true;

  jardin.innerHTML = "";

  document.getElementById("mensajeAtrapa").textContent = "";
  document.getElementById("botonIniciarAtrapa").textContent =
    "🔄 Reiniciar";

  actualizarMarcadorAtrapa();
  mostrarUmaAtrapa();

  intervaloTiempoAtrapa = setInterval(() => {
    if (!partidaAtrapaActiva) return;

    tiempoRestanteAtrapa--;
    actualizarMarcadorAtrapa();

    if (tiempoRestanteAtrapa <= 0) {
      finalizarAtrapa();
    }
  }, 1000);
}

function mostrarUmaAtrapa() {
  if (!partidaAtrapaActiva) return;

  clearTimeout(temporizadorUmaAtrapa);

  const jardin = document.getElementById("jardinAtrapa");
  jardin.innerHTML = "";

  const personaje = personajesAtrapa[
    Math.floor(Math.random() * personajesAtrapa.length)
  ];

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "uma-atrapable";
  boton.setAttribute("aria-label", "Atrapar a " + personaje.nombre);

  const imagen = document.createElement("img");
  imagen.src = personaje.imagen;
  imagen.alt = personaje.nombre;

  boton.appendChild(imagen);

  // Posición aleatoria sin salirse del jardín.
  const anchoDisponible = Math.max(
    0,
    jardin.clientWidth - (window.innerWidth <= 600 ? 78 : 105)
  );

  const altoDisponible = Math.max(
    0,
    jardin.clientHeight - (window.innerWidth <= 600 ? 88 : 115)
  );

  boton.style.left = Math.random() * anchoDisponible + "px";
  boton.style.top = Math.random() * altoDisponible + "px";

  boton.addEventListener("click", () => {
    if (!partidaAtrapaActiva) return;

    // Evita contar dos veces la misma Uma.
    boton.disabled = true;

    puntosAtrapa += 10;

    if (puntosAtrapa > leerRecordAtrapa()) {
      guardarRecordAtrapa(puntosAtrapa);
    }

    actualizarMarcadorAtrapa();
    mostrarUmaAtrapa();
  });

  jardin.appendChild(boton);

  const nivel = document.getElementById("nivelAtrapa").value;
  const tiempoAparicion = configuracionAtrapa[nivel].aparicion;

  temporizadorUmaAtrapa = setTimeout(() => {
    mostrarUmaAtrapa();
  }, tiempoAparicion);
}

function finalizarAtrapa() {
  if (!partidaAtrapaActiva) return;

  partidaAtrapaActiva = false;
  limpiarTemporizadoresAtrapa();

  document.getElementById("jardinAtrapa").innerHTML = "";

  document.getElementById("mensajeAtrapa").textContent =
    `🎉 ¡Tiempo terminado! Conseguíste ${puntosAtrapa} puntos.`;

  document.getElementById("botonIniciarAtrapa").textContent =
    "▶ Jugar otra vez";
}

function detenerAtrapa() {
  if (!partidaAtrapaActiva) return;

  partidaAtrapaActiva = false;
  limpiarTemporizadoresAtrapa();

  document.getElementById("jardinAtrapa").innerHTML = "";

  document.getElementById("mensajeAtrapa").textContent =
    "⏹ Partida detenida.";

  document.getElementById("botonIniciarAtrapa").textContent =
    "▶ Comenzar";
}

// Cambiar dificultad reinicia la partida actual.
document.getElementById("nivelAtrapa")?.addEventListener(
  "change",
  () => {
    detenerAtrapa();

    const nivel = document.getElementById("nivelAtrapa").value;
    tiempoRestanteAtrapa = configuracionAtrapa[nivel].duracion;

    actualizarMarcadorAtrapa();
  }
);

// Mostrar el récord al cargar.
window.addEventListener("load", () => {
  if (!document.getElementById("jardinAtrapa")) return;
  actualizarMarcadorAtrapa();
});

let parejasEncontradas = 0;


/* ========================================
   CREAR / REINICIAR MEMORAMA
======================================== */

function iniciarMemorama() {

    const tablero =
        document.getElementById("tableroMemorama");

    const contadorMovimientos =
        document.getElementById("movimientos");

    const contadorParejas =
        document.getElementById("parejas");

    const mensaje =
        document.getElementById("mensajeMemorama");


    /* Si el tablero no existe, detener */

    if (!tablero) {
        console.log("No se encontró el tablero del memorama.");
        return;
    }


    /* Duplicamos las 6 Umas para crear 12 cartas */

    let cartas = [
        ...umasMemorama,
        ...umasMemorama
    ];


    /* Mezclar cartas */

    cartas.sort(() => Math.random() - 0.5);


    /* Limpiar tablero */

    tablero.innerHTML = "";


    /* Reiniciar variables */

    primeraCarta = null;
    segundaCarta = null;

    bloquearTablero = false;

    movimientos = 0;
    parejasEncontradas = 0;


    /* Reiniciar marcador */

    if (contadorMovimientos) {
        contadorMovimientos.textContent = "0";
    }

    if (contadorParejas) {
        contadorParejas.textContent = "0";
    }

    if (mensaje) {
        mensaje.textContent = "";
    }


    /* ========================================
       CREAR LAS 12 CARTAS
    ======================================== */

    cartas.forEach((uma) => {

        const carta =
            document.createElement("div");


        carta.className = "carta-memorama";

        carta.dataset.nombre = uma.nombre;


        carta.innerHTML = `

            <div class="carta-interior">

                <div class="carta-frente">

                    🌸

                </div>


                <div class="carta-atras">

                    <img
                        src="${uma.imagen}"
                        alt="${uma.nombre}"
                    >

                    <span>
                        ${uma.nombre}
                    </span>

                </div>

            </div>

        `;


        carta.addEventListener("click", function () {

            voltearCarta(carta);

        });


        tablero.appendChild(carta);

    });


    console.log(
        "Memorama iniciado con",
        cartas.length,
        "cartas."
    );

}


/* ========================================
   VOLTEAR CARTA
======================================== */

function voltearCarta(carta) {

    if (bloquearTablero) {
        return;
    }


    if (carta === primeraCarta) {
        return;
    }


    if (carta.classList.contains("encontrada")) {
        return;
    }


    carta.classList.add("volteada");


    /* Primera selección */

    if (primeraCarta === null) {

        primeraCarta = carta;

        return;

    }


    /* Segunda selección */

    segundaCarta = carta;

    movimientos++;


    const contador =
        document.getElementById("movimientos");


    if (contador) {
        contador.textContent = movimientos;
    }


    comprobarPareja();

}


/* ========================================
   COMPROBAR PAREJA
======================================== */

function comprobarPareja() {

    const sonIguales =
        primeraCarta.dataset.nombre ===
        segundaCarta.dataset.nombre;


    /* =========================
       PAREJA CORRECTA
    ========================== */

    if (sonIguales) {

        primeraCarta.classList.add("encontrada");

        segundaCarta.classList.add("encontrada");


        parejasEncontradas++;


        const contador =
            document.getElementById("parejas");


        if (contador) {
            contador.textContent = parejasEncontradas;
        }


        reiniciarTurno();


        /* Victoria */

        if (
            parejasEncontradas ===
            umasMemorama.length
        ) {

            const mensaje =
                document.getElementById(
                    "mensajeMemorama"
                );


            if (mensaje) {

                mensaje.textContent =
                    "🌸 ¡Encontraste a todas las Umas! ¡Muy bien! 🌸";

            }

        }


        return;

    }


    /* =========================
       PAREJA INCORRECTA
    ========================== */

    bloquearTablero = true;


    setTimeout(function () {

        primeraCarta.classList.remove(
            "volteada"
        );

        segundaCarta.classList.remove(
            "volteada"
        );


        reiniciarTurno();

    }, 900);

}


/* ========================================
   PREPARAR SIGUIENTE TURNO
======================================== */

function reiniciarTurno() {

    primeraCarta = null;
    segundaCarta = null;

    bloquearTablero = false;

}


/* ========================================
   NAVEGACIÓN DE UMAGARDEN
======================================== */

function mostrarSeccion(nombre) {

    const ids = [
        "inicio",
        "jardin",
        "personajes",
        "juegos",
        "galeria",
        "musica",
        "acerca"
    ];


    /* Ocultar todas las secciones existentes */

    ids.forEach(function(id) {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.classList.add("seccion-oculta");
        }

    });


    /* INICIO muestra Bienvenida + Jardín */

    if (nombre === "inicio") {

        const inicio = document.getElementById("inicio");
        const jardin = document.getElementById("jardin");

        if (inicio) {
            inicio.classList.remove("seccion-oculta");
        }

        if (jardin) {
            jardin.classList.remove("seccion-oculta");
        }

    }

    /* Los demás muestran solamente su sección */

    else {

        const seleccionada =
            document.getElementById(nombre);

        if (seleccionada) {
            seleccionada.classList.remove("seccion-oculta");
        }

    }


    /* Actualizar la dirección */

    history.replaceState(
        null,
        "",
        "#" + nombre
    );


    /* Subir suavemente */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

/* ========================================
   INICIAR UMAGARDEN
======================================== */

window.addEventListener("load", function () {

    /* Crear las cartas del memorama */
    iniciarMemorama();

    /* Al entrar, mostrar solamente Inicio + Jardín */
    mostrarSeccion("inicio");

});

/* ========================================
   MÚSICA DE FONDO - YOUTUBE
======================================== */

let reproductorYoutube;
let musicaActiva = false;


/* ========================================
   CREAR REPRODUCTOR DE YOUTUBE
======================================== */

function onYouTubeIframeAPIReady() {
  
  if (reproductorYoutube) return;

    reproductorYoutube = new YT.Player("youtubePlayer", {

        height: "1",
        width: "1",

        videoId: "cdgbTEE8GJE",

        playerVars: {

            autoplay: 0,

            controls: 0,

            loop: 1,

            playlist: "cdgbTEE8GJE",

            playsinline: 1

        },

        events: {

            onReady: function () {

                reproductorYoutube.setVolume(35);

                console.log(
                    "🎵 Reproductor de UmaGarden listo."
                );

            }

        }

    });

}

/* ========================================
   🎵 INICIALIZACIÓN AUTOMÁTICA DE YOUTUBE
======================================== */

if (window.YT && typeof YT.Player === "function") {
  if (!reproductorYoutube) {
    onYouTubeIframeAPIReady();
  }
}


/* ========================================
   ENCENDER / APAGAR MÚSICA
======================================== */

function alternarMusica() {

    const boton =
        document.getElementById("botonMusica");


    if (!reproductorYoutube) {

        console.log(
            "El reproductor de YouTube todavía no está listo."
        );

        return;

    }


    /* ENCENDER */

    if (!musicaActiva) {

        reproductorYoutube.setVolume(35);

        reproductorYoutube.playVideo();

        musicaActiva = true;


        if (boton) {

            boton.textContent =
                "🔊 Música ON";

        }

    }


    /* APAGAR */

    else {

        reproductorYoutube.pauseVideo();

        musicaActiva = false;


        if (boton) {

            boton.textContent =
                "🔇 Música OFF";

        }

    }

}

/* ========================================
   🧩 ROMPECABEZAS UMAGARDEN
======================================== */

let piezasPuzzle = [];
let movimientosPuzzle = 0;
let puzzleResuelto = false;

function iniciarRompecabezas() {

  const tablero = document.getElementById("tableroPuzzle");
  if (!tablero) return;

  const tamaño = Number(
    document.getElementById("dificultadPuzzle").value
  );

  const total = tamaño * tamaño;

  piezasPuzzle = Array.from(
    { length: total },
    (_, i) => (i + 1) % total
  );

  // Mezclar mediante movimientos válidos
  // para garantizar que el puzzle sea resoluble.
  let posicionVacia = total - 1;
  let posicionAnterior = -1;

  for (let i = 0; i < total * 30; i++) {

    const vecinos = obtenerVecinosPuzzle(
      posicionVacia,
      tamaño
    ).filter(pos => pos !== posicionAnterior);

    const siguiente = vecinos[
      Math.floor(Math.random() * vecinos.length)
    ];

    [piezasPuzzle[posicionVacia], piezasPuzzle[siguiente]] =
    [piezasPuzzle[siguiente], piezasPuzzle[posicionVacia]];

    posicionAnterior = posicionVacia;
    posicionVacia = siguiente;
  }

  movimientosPuzzle = 0;
  puzzleResuelto = false;

  document.getElementById("movimientosPuzzle").textContent = "0";
  document.getElementById("mensajePuzzle").textContent = "";

  dibujarRompecabezas();
}


function obtenerVecinosPuzzle(posicion, tamaño) {

  const fila = Math.floor(posicion / tamaño);
  const columna = posicion % tamaño;
  const vecinos = [];

  if (fila > 0) vecinos.push(posicion - tamaño);
  if (fila < tamaño - 1) vecinos.push(posicion + tamaño);
  if (columna > 0) vecinos.push(posicion - 1);
  if (columna < tamaño - 1) vecinos.push(posicion + 1);

  return vecinos;
}


function dibujarRompecabezas() {

  const tablero = document.getElementById("tableroPuzzle");
  const tamaño = Number(
    document.getElementById("dificultadPuzzle").value
  );

  const imagen = document.getElementById("umaPuzzle").value;

  tablero.innerHTML = "";
  tablero.style.gridTemplateColumns = `repeat(${tamaño}, 1fr)`;
  tablero.style.gridTemplateRows = `repeat(${tamaño}, 1fr)`;

  piezasPuzzle.forEach((numero, posicion) => {

    const pieza = document.createElement("button");
    pieza.type = "button";
    pieza.className = "pieza-puzzle";

    if (numero === 0) {
      pieza.classList.add("vacia");
      pieza.setAttribute("aria-label", "Espacio vacío");
    } else {

      const indiceOriginal = numero - 1;
      const fila = Math.floor(indiceOriginal / tamaño);
      const columna = indiceOriginal % tamaño;

      pieza.style.backgroundImage = `url("${imagen}")`;
      pieza.style.backgroundSize = `${tamaño * 100}% ${tamaño * 100}%`;

      pieza.style.backgroundPosition =
        `${columna * 100 / (tamaño - 1)}% ` +
        `${fila * 100 / (tamaño - 1)}%`;

      pieza.setAttribute("aria-label", `Pieza ${numero}`);
      pieza.onclick = () => moverPiezaPuzzle(posicion);
    }

    tablero.appendChild(pieza);
  });
}


function moverPiezaPuzzle(posicion) {

  if (puzzleResuelto) return;

  const tamaño = Number(
    document.getElementById("dificultadPuzzle").value
  );

  const vacia = piezasPuzzle.indexOf(0);

  if (!obtenerVecinosPuzzle(vacia, tamaño).includes(posicion)) {
    return;
  }

  [piezasPuzzle[vacia], piezasPuzzle[posicion]] =
  [piezasPuzzle[posicion], piezasPuzzle[vacia]];

  movimientosPuzzle++;

  document.getElementById("movimientosPuzzle").textContent =
    movimientosPuzzle;

  dibujarRompecabezas();

  const resuelto = piezasPuzzle.every(
    (numero, indice) =>
      numero === (indice + 1) % piezasPuzzle.length
  );

  if (resuelto) {
    puzzleResuelto = true;

    document.getElementById("mensajePuzzle").textContent =
      `🎉 ¡Felicidades! Completaste el rompecabezas en ${movimientosPuzzle} movimientos.`;
  }
}


// Reiniciar cuando cambie el personaje o la dificultad.
document.getElementById("umaPuzzle")?.addEventListener(
  "change",
  iniciarRompecabezas
);

document.getElementById("dificultadPuzzle")?.addEventListener(
  "change",
  iniciarRompecabezas
);

// Inicializar al cargar la página.
window.addEventListener("load", iniciarRompecabezas);


/* ========================================
   🔎 ENCUENTRA LAS DIFERENCIAS
======================================== */

  const objetosBaseDiferencias = [
  { x: 12, y: 15, emoji: "☀️", otro: "🌤️" },
  { x: 48, y: 13, emoji: "☁️", otro: "🌥️" },
  { x: 85, y: 18, emoji: "🌈", otro: "🌦️" },
  { x: 18, y: 52, emoji: "🌳", otro: "🌲" },
  { x: 82, y: 53, emoji: "🌷", otro: "🌹" },
  { x: 15, y: 87, emoji: "🌼", otro: "🌻" },
  { x: 50, y: 88, emoji: "🍄", otro: "🍄‍🟫" },
  { x: 85, y: 87, emoji: "🦋", otro: "🦇" },
  { x: 33, y: 46, emoji: "💚", otro: "💙" },
  { x: 67, y: 45, emoji: "🎀", otro: "🎗️" }
];

const umasDiferencias = [
  {
    x: 30, y: 72,
    imagen: "/characters/bourbon-dance.gif"
  },
  {
    x: 43, y: 72,
    imagen: "/characters/creek-dance.gif"
  },
  {
    x: 57, y: 72,
    imagen: "/characters/machan-dance.gif"
  },
  {
    x: 70, y: 72,
    imagen: "/characters/goldship-dance.gif"
  }
];

let diferenciasActuales = [];
let diferenciasEncontradas = new Set();
let tiempoRestanteDiferencias = 0;
let intervaloDiferencias = null;
let partidaDiferenciasActiva = false;
let pistasUsadasDiferencias = 0;

function iniciarDiferencias() {
  clearInterval(intervaloDiferencias);

  const nivel = document.getElementById("nivelDiferencias");
  if (!nivel) return;

  const configuraciones = {
    facil: { cantidad: 3, tiempo: null },
    medio: { cantidad: 5, tiempo: 90 },
    dificil: { cantidad: 7, tiempo: 60 }
  };

  const config = configuraciones[nivel.value];

  const indices = objetosBaseDiferencias.map((_, i) => i);

  // Selección aleatoria sin repetir.
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  diferenciasActuales = indices.slice(0, config.cantidad);
  diferenciasEncontradas.clear();
  pistasUsadasDiferencias = 0;
  partidaDiferenciasActiva = true;

  tiempoRestanteDiferencias = config.tiempo;

  document.getElementById("mensajeDiferencias").textContent = "";
  document.getElementById("tiempoDiferencias").textContent =
    config.tiempo === null ? "∞" : config.tiempo + " s";

  actualizarMarcadorDiferencias();
  dibujarEscenasDiferencias();

  if (config.tiempo !== null) {
    intervaloDiferencias = setInterval(() => {
      tiempoRestanteDiferencias--;

      document.getElementById("tiempoDiferencias").textContent =
        tiempoRestanteDiferencias + " s";

      if (tiempoRestanteDiferencias <= 0) {
        finalizarDiferencias(false);
      }
    }, 1000);
  }
}

function dibujarEscenasDiferencias() {
  const original = document.getElementById("escenaOriginal");
  const modificada = document.getElementById("escenaModificada");

  if (!original || !modificada) return;

  original.innerHTML = "";
  modificada.innerHTML = "";

  [original, modificada].forEach((escena, lado) => {

    objetosBaseDiferencias.forEach((objeto, indice) => {
      const boton = document.createElement("button");

      boton.type = "button";
      boton.className = "objeto-diferencias";
      boton.style.left = objeto.x + "%";
      boton.style.top = objeto.y + "%";

      const esDiferencia = diferenciasActuales.includes(indice);

      boton.textContent =
        lado === 1 && esDiferencia
          ? objeto.otro
          : objeto.emoji;

      boton.setAttribute(
        "aria-label",
        `Elemento del jardín ${indice + 1}`
      );

      if (diferenciasEncontradas.has(indice)) {
        boton.classList.add("encontrado");
      }

      boton.addEventListener("click", () => {
        comprobarDiferencia(indice);
      });

      escena.appendChild(boton);
    });

    umasDiferencias.forEach(uma => {
      const elemento = document.createElement("div");
      elemento.className = "objeto-diferencias uma-escena-diferencias";
      elemento.style.left = uma.x + "%";
      elemento.style.top = uma.y + "%";
      elemento.style.pointerEvents = "none";

      const imagen = document.createElement("img");
      imagen.src = uma.imagen;
      imagen.alt = "Uma del jardín";

      elemento.appendChild(imagen);
      escena.appendChild(elemento);
    });
  });
}

function comprobarDiferencia(indice) {
  if (!partidaDiferenciasActiva) return;

  if (!diferenciasActuales.includes(indice)) return;
  if (diferenciasEncontradas.has(indice)) return;

  diferenciasEncontradas.add(indice);

  actualizarMarcadorDiferencias();
  dibujarEscenasDiferencias();

  if (
    diferenciasEncontradas.size === diferenciasActuales.length
  ) {
    finalizarDiferencias(true);
  }
}

function actualizarMarcadorDiferencias() {
  const marcador = document.getElementById("aciertosDiferencias");

  if (marcador) {
    marcador.textContent =
      `${diferenciasEncontradas.size}/${diferenciasActuales.length}`;
  }
}

function usarPistaDiferencias() {
  if (!partidaDiferenciasActiva) return;

  const mensaje = document.getElementById("mensajeDiferencias");

  if (pistasUsadasDiferencias >= 3) {
    mensaje.textContent = "💡 Ya utilizaste tus 3 pistas.";
    return;
  }

  const pendientes = diferenciasActuales.filter(
    indice => !diferenciasEncontradas.has(indice)
  );

  if (pendientes.length === 0) return;

  const indice = pendientes[
    Math.floor(Math.random() * pendientes.length)
  ];

  pistasUsadasDiferencias++;

  const escenas = [
    document.getElementById("escenaOriginal"),
    document.getElementById("escenaModificada")
  ];

  escenas.forEach(escena => {
    const objeto = escena.children[indice];
    if (!objeto) return;

    objeto.classList.add("pista");

    setTimeout(() => {
      objeto.classList.remove("pista");
    }, 2500);
  });

  mensaje.textContent =
    `💡 Pista utilizada (${pistasUsadasDiferencias}/3).`;
}

function finalizarDiferencias(victoria) {
  partidaDiferenciasActiva = false;
  clearInterval(intervaloDiferencias);

  const mensaje = document.getElementById("mensajeDiferencias");

  if (victoria) {
    mensaje.textContent =
      "🎉 ¡Excelente! Encontraste todas las diferencias.";
  } else {
    mensaje.textContent =
      "⏰ ¡Se terminó el tiempo! Inténtalo de nuevo.";
  }
}

document.getElementById("nivelDiferencias")?.addEventListener(
  "change",
  iniciarDiferencias
);

window.addEventListener("load", iniciarDiferencias);

/* ========================================
   🗑️ REINICIAR RÉCORD DE ATRAPA A LAS UMAS
======================================== */

function reiniciarRecordAtrapa() {

  const confirmar = confirm(
    "¿Seguro que quieres borrar tu récord de Atrapa a las Umas?"
  );

  if (!confirmar) return;

  try {
    localStorage.removeItem("recordUmaGardenAtrapa");
  } catch (error) {
    alert("No se pudo borrar el récord del navegador.");
    return;
  }

  actualizarMarcadorAtrapa();

  document.getElementById("mensajeAtrapa").textContent =
    "🗑️ ¡Récord reiniciado correctamente!";
}


/* ========================================
   🌸 SOPA DE LETRAS UMAGARDEN
======================================== */

const configuracionSopa = {
  facil: {
    tamaño: 8,
    palabras: ["HARU", "UMA", "GOLD", "CRE E K".replaceAll(" ", "")]
  },
  medio: {
    tamaño: 10,
    palabras: [
      "BOURBON", "MACHAN", "TACHYON",
      "ESFUERZO", "GOLD", "HARU"
    ]
  },
  dificil: {
    tamaño: 12,
    palabras: [
      "BOURBON", "MACHAN", "TACHYON",
      "ESFUERZO", "CONFIANZA", "RESPETO",
      "GOLD", "HARU"
    ]
  }
};

const direccionesSopa = [
  [0, 1], [1, 0], [1, 1], [1, -1],
  [0, -1], [-1, 0], [-1, -1], [-1, 1]
];

let matrizSopa = [];
let ubicacionesSopa = [];
let encontradasSopa = new Set();
let seleccionSopa = [];
let inicioSeleccionSopa = null;
let seleccionandoSopa = false;
let pistasRestantesSopa = 3;
let tamañoActualSopa = 8;
let palabrasActualesSopa = [];
let sopaCompletada = false;

function mezclarSopa(lista) {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

function iniciarSopa() {
  const selector = document.getElementById("nivelSopa");
  if (!selector) return;

  const config = configuracionSopa[selector.value];

  tamañoActualSopa = config.tamaño;
  palabrasActualesSopa = [...config.palabras];
  encontradasSopa.clear();
  seleccionSopa = [];
  inicioSeleccionSopa = null;
  seleccionandoSopa = false;
  pistasRestantesSopa = 3;
  sopaCompletada = false;

  // Intentar generar un tablero válido.
  let generado = false;

  for (let intento = 0; intento < 100 && !generado; intento++) {
    matrizSopa = Array.from(
      { length: tamañoActualSopa },
      () => Array(tamañoActualSopa).fill("")
    );

    ubicacionesSopa = [];
    generado = true;

    for (const palabra of mezclarSopa(palabrasActualesSopa)) {
      if (!colocarPalabraSopa(palabra)) {
        generado = false;
        break;
      }
    }
  }

  if (!generado) {
    document.getElementById("mensajeSopa").textContent =
      "No se pudo generar el tablero. Intenta otra vez.";
    return;
  }

  const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

  for (let fila = 0; fila < tamañoActualSopa; fila++) {
    for (let columna = 0; columna < tamañoActualSopa; columna++) {
      if (!matrizSopa[fila][columna]) {
        matrizSopa[fila][columna] =
          letras[Math.floor(Math.random() * letras.length)];
      }
    }
  }

  document.getElementById("mensajeSopa").textContent = "";

  actualizarSopa();
  dibujarSopa();
}

function colocarPalabraSopa(palabra) {
  const opciones = [];

  for (const [df, dc] of direccionesSopa) {
    for (let fila = 0; fila < tamañoActualSopa; fila++) {
      for (let columna = 0; columna < tamañoActualSopa; columna++) {

        const finalFila = fila + df * (palabra.length - 1);
        const finalColumna = columna + dc * (palabra.length - 1);

        if (
          finalFila < 0 || finalFila >= tamañoActualSopa ||
          finalColumna < 0 || finalColumna >= tamañoActualSopa
        ) continue;

        const posiciones = [];
        let valido = true;

        for (let k = 0; k < palabra.length; k++) {
          const f = fila + df * k;
          const c = columna + dc * k;

          if (matrizSopa[f][c] &&
              matrizSopa[f][c] !== palabra[k]) {
            valido = false;
            break;
          }

          posiciones.push(f * tamañoActualSopa + c);
        }

        if (valido) opciones.push(posiciones);
      }
    }
  }

  if (opciones.length === 0) return false;

  const posiciones = opciones[
    Math.floor(Math.random() * opciones.length)
  ];

  posiciones.forEach((indice, i) => {
    const fila = Math.floor(indice / tamañoActualSopa);
    const columna = indice % tamañoActualSopa;
    matrizSopa[fila][columna] = palabra[i];
  });

  ubicacionesSopa.push({ palabra, posiciones });
  return true;
}

function obtenerLineaSopa(inicio, final) {
  const f1 = Math.floor(inicio / tamañoActualSopa);
  const c1 = inicio % tamañoActualSopa;
  const f2 = Math.floor(final / tamañoActualSopa);
  const c2 = final % tamañoActualSopa;

  const df = f2 - f1;
  const dc = c2 - c1;

  if (
    df !== 0 &&
    dc !== 0 &&
    Math.abs(df) !== Math.abs(dc)
  ) return [inicio];

  const pasos = Math.max(Math.abs(df), Math.abs(dc));

  if (pasos === 0) return [inicio];

  const pasoFila = Math.sign(df);
  const pasoColumna = Math.sign(dc);

  const linea = [];

  for (let k = 0; k <= pasos; k++) {
    linea.push(
      (f1 + k * pasoFila) * tamañoActualSopa +
      (c1 + k * pasoColumna)
    );
  }

  return linea;
}

function dibujarSopa() {
  const tablero = document.getElementById("tableroSopa");
  if (!tablero) return;

  tablero.innerHTML = "";
  tablero.style.gridTemplateColumns =
    `repeat(${tamañoActualSopa}, minmax(0, 1fr))`;
  tablero.style.gridTemplateRows =
    `repeat(${tamañoActualSopa}, minmax(0, 1fr))`;

  const celdasEncontradas = new Set();

  ubicacionesSopa.forEach(ubicacion => {
    if (encontradasSopa.has(ubicacion.palabra)) {
      ubicacion.posiciones.forEach(i => celdasEncontradas.add(i));
    }
  });

  matrizSopa.forEach((fila, f) => {
    fila.forEach((letra, c) => {
      const indice = f * tamañoActualSopa + c;
      const celda = document.createElement("div");

      celda.className = "celda-sopa";
      celda.textContent = letra;
      celda.dataset.indice = indice;

      if (celdasEncontradas.has(indice)) {
        celda.classList.add("encontrada");
      }

      if (seleccionSopa.includes(indice)) {
        celda.classList.add("seleccionada");
      }

      tablero.appendChild(celda);
    });
  });
}

function actualizarSeleccionSopa() {
  const celdas = document.querySelectorAll(
    "#tableroSopa .celda-sopa"
  );

  celdas.forEach((celda, indice) => {
    celda.classList.toggle(
      "seleccionada",
      seleccionSopa.includes(indice)
    );
  });
}

function actualizarSopa() {
  document.getElementById("aciertosSopa").textContent =
    `${encontradasSopa.size}/${palabrasActualesSopa.length}`;

  document.getElementById("pistasSopa").textContent =
    pistasRestantesSopa;

  const contenedor = document.getElementById("palabrasSopa");
  contenedor.innerHTML = "";

  palabrasActualesSopa.forEach(palabra => {
    const elemento = document.createElement("span");
    elemento.className = "palabra-sopa";
    elemento.textContent = palabra;

    if (encontradasSopa.has(palabra)) {
      elemento.classList.add("completada");
    }

    contenedor.appendChild(elemento);
  });
}

function terminarSeleccionSopa() {
  if (!seleccionandoSopa) return;

  seleccionandoSopa = false;

  const seleccion = [...seleccionSopa];

  const encontrada = ubicacionesSopa.find(ubicacion => {
    if (encontradasSopa.has(ubicacion.palabra)) return false;

    const original = ubicacion.posiciones;
    const invertida = [...original].reverse();

    return (
      JSON.stringify(seleccion) === JSON.stringify(original) ||
      JSON.stringify(seleccion) === JSON.stringify(invertida)
    );
  });

  if (encontrada) {
    encontradasSopa.add(encontrada.palabra);

    document.getElementById("mensajeSopa").textContent =
      `🌸 ¡Encontraste ${encontrada.palabra}!`;

    if (encontradasSopa.size === palabrasActualesSopa.length) {
      sopaCompletada = true;

      document.getElementById("mensajeSopa").textContent =
        "🎉 ¡Felicidades! Encontraste todas las palabras.";
    }
  }

  seleccionSopa = [];
  inicioSeleccionSopa = null;

  actualizarSopa();
  dibujarSopa();
}

function usarPistaSopa() {
  if (sopaCompletada || pistasRestantesSopa <= 0) return;

  const pendientes = ubicacionesSopa.filter(
    u => !encontradasSopa.has(u.palabra)
  );

  if (pendientes.length === 0) return;

  const elegida = pendientes[
    Math.floor(Math.random() * pendientes.length)
  ];

  pistasRestantesSopa--;
  actualizarSopa();

  const tablero = document.getElementById("tableroSopa");
  const indice = elegida.posiciones[0];
  const celda = tablero.children[indice];

  if (!celda) return;

  celda.classList.add("pista");

  setTimeout(() => {
    celda.classList.remove("pista");
  }, 2500);

  document.getElementById("mensajeSopa").textContent =
    `💡 Busca la palabra ${elegida.palabra} desde la letra señalada.`;
}

// Eventos Pointer: funcionan con mouse y pantalla táctil.
const tableroSopaElemento = document.getElementById("tableroSopa");

if (tableroSopaElemento) {
  tableroSopaElemento.addEventListener("pointerdown", evento => {
    if (sopaCompletada) return;

    const celda = evento.target.closest(".celda-sopa");
    if (!celda) return;

    evento.preventDefault();
    seleccionandoSopa = true;
    inicioSeleccionSopa = Number(celda.dataset.indice);
    seleccionSopa = [inicioSeleccionSopa];

    tableroSopaElemento.setPointerCapture(evento.pointerId);
    actualizarSeleccionSopa();
  });

  tableroSopaElemento.addEventListener("pointermove", evento => {
    if (!seleccionandoSopa) return;

    const elemento = document.elementFromPoint(
      evento.clientX,
      evento.clientY
    );

    const celda = elemento?.closest(".celda-sopa");

    if (!celda || !tableroSopaElemento.contains(celda)) return;

    const indiceFinal = Number(celda.dataset.indice);

    seleccionSopa = obtenerLineaSopa(
      inicioSeleccionSopa,
      indiceFinal
    );

    actualizarSeleccionSopa();
  });

  tableroSopaElemento.addEventListener(
    "pointerup",
    terminarSeleccionSopa
  );

  tableroSopaElemento.addEventListener(
    "pointercancel",
    () => {
      seleccionandoSopa = false;
      seleccionSopa = [];
      inicioSeleccionSopa = null;
      actualizarSeleccionSopa();
    }
  );
}

document.getElementById("nivelSopa")?.addEventListener(
  "change",
  iniciarSopa
);

window.addEventListener("load", iniciarSopa);
