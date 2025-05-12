var YouTube = document.querySelector('.YouTube');
var idList = document.querySelector('.idList');
var hidden = document.querySelector('.hidden');
var loadingSpinner = document.getElementById('loading');
var sidebar = document.getElementById('sidebar');

// Función para abrir la barra lateral
document.getElementById('openBtn').addEventListener('click', function() {
    sidebar.classList.toggle('active');
});

// Función para mostrar el spinner y procesar la URL
function Get() {
    // Mostrar el spinner
    loadingSpinner.style.display = 'block';

    let videoId = "";
    let url = YouTube.value.trim();

    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
        videoId = new URL(url).searchParams.get("v");
    } else if (url.includes("youtube.com/shorts/")) {
        videoId = url.split("youtube.com/shorts/")[1].split("?")[0];
    } else {
        alert('Introduce una URL válida');
        loadingSpinner.style.display = 'none';
        return;
    }

    idList.value = videoId;
    getVideoInfo(videoId);
}

// Función para obtener información del video y mostrar botones
async function getVideoInfo(videoId) {
    const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '2b929025ddmshd3302ab633a818cp1ab4cdjsne14ca95e2a8d',
                'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            }
        });

        const data = await response.json();

        if (!data || !data.link || !data.title) {
            alert("No se pudo obtener la información del video.");
            loadingSpinner.style.display = 'none';
            return;
        }

        // Ocultar el spinner y mostrar los botones de descarga
        loadingSpinner.style.display = 'none';
        hidden.classList.add('active');

        // Crear botones de descarga dinámicamente
        mostrarBotonesDescarga(videoId, data.title);
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        alert("Hubo un problema al procesar la solicitud.");
        loadingSpinner.style.display = 'none';
    }
}

// Función para mostrar los botones de descarga
function mostrarBotonesDescarga(videoId, title) {
    let contenedor = document.querySelector('.hidden');
    contenedor.innerHTML = `
        <button class="Get" onclick="downloadMP3('${videoId}', '${title}')">Descargar MP3</button>
        <button class="Get" onclick="obtenerEnlacesMP4('${videoId}', '${title}')">Descargar MP4</button>
    `;
}

// Función para descargar MP3
function downloadMP3(videoId, title) {
    const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2b929025ddmshd3302ab633a818cp1ab4cdjsne14ca95e2a8d',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data || !data.link) {
            alert("No se pudo obtener la descarga en MP3.");
            return;
        }

        
        const anchor = document.createElement("a");
        anchor.href = data.link;
        anchor.download = `${title}.mp3`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        alert('Descargando MP3...');
        saveToHistory(title, `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);

    })
    .catch(error => {
        console.error("Error al descargar MP3:", error);
        alert("Hubo un problema al descargar el MP3.");
    });

    
}

// Función para obtener enlaces MP4
// Función para obtener información del video y mostrar botones para MP4
async function obtenerEnlacesMP4() {
    // Mostrar el spinner
    loadingSpinner.style.display = 'block';

    let videoId = "";
    let url = YouTube.value.trim();

    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
        videoId = new URL(url).searchParams.get("v");
    } else if (url.includes("youtube.com/shorts/")) {
        videoId = url.split("youtube.com/shorts/")[1].split("?")[0];
    } else {
        alert('Introduce una URL válida');
        loadingSpinner.style.display = 'none';
        return;
    }

    idList.value = videoId;
    obtenerInfoMP4(videoId);
}

// Función para obtener información del video y mostrar botones MP4
async function obtenerInfoMP4(videoId) {
    const apiUrlMP4 = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`

    try {
        const response = await fetch(apiUrlMP4, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'fc4991b217msh36f1b876c8ae922p1b1704jsn43d51f09c612',
                'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
            }
        });

        const data = await response.json();

        console.log("Respuesta completa:", response);
        console.log("Datos completos de la API:", data);
        console.log("Formats disponibles:", data.formats);
        console.log("Adaptive Formats disponibles:", data.adaptiveFormats);

        console.log("Datos en JSON:", data);

        if (!data || !data.formats || data.formats.length === 0) {
            alert("No se pudo obtener la información del video para MP4.");
            loadingSpinner.style.display = 'none';
            return;
        }

        // Ocultar el spinner y mostrar los botones de descarga
        loadingSpinner.style.display = 'none';
        hidden.classList.add('active');

        // Crear botones de descarga dinámicamente
        mostrarBotonesDescargaMP4(data.title, data.formats);
    } catch (error) {
        console.error("Error al obtener los datos de MP4:", error);
        alert("Hubo un problema al procesar la solicitud.");
        loadingSpinner.style.display = 'none';
    }
}

// Función para mostrar los botones de descarga para MP4
function mostrarBotonesDescargaMP4(title, formats) {
    let contenedor = document.querySelector('.hidden');
    contenedor.innerHTML = `
        <h3>MP4: ${title}</h3>
    `;

    formats.forEach(format => {
        const btn = document.createElement("button");
        btn.innerText = `Descargar`;
        btn.classList.add("Get");
        btn.onclick = () => descargarMP4(format.download, title);
        contenedor.appendChild(btn);
        console.log(format);
    });
}

// Función para descargar MP4
async function descargarMP4(url, title) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${title}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("No se pudo descargar el archivo. Por favor, inténtalo de nuevo.");
    }
}
///historial
function saveToHistory(title, thumbnailUrl) {
    const historial = JSON.parse(localStorage.getItem('historialDescargas')) || [];

    historial.push({
        title: title,
        thumbnail: thumbnailUrl
    });

    localStorage.setItem('historialDescargas', JSON.stringify(historial));
}
