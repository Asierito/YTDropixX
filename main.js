var YouTube = document.querySelector('.YouTube');
var idList = document.querySelector('.idList');
var hidden = document.querySelector('.hidden');

// Función para mostrar el spinner y procesar la URL
function Get() {
    // Mostrar el spinner
    document.getElementById('loading').style.display = 'block';

    if(YouTube.value.indexOf("https://youtu.be/") != -1){
        var YTurl = YouTube.value.replace("https://youtu.be/","");
        document.querySelector('.idList').value = YTurl;
        Music();
    }
    else if(YouTube.value.indexOf("https://www.youtube.com/watch?v=") != -1){
        var YTurl = YouTube.value.replace("https://www.youtube.com/watch?v=","");
        document.querySelector('.idList').value = YTurl;
        Music();
    }
    else if(YouTube.value.indexOf("https://www.youtube.com/shorts/") != -1){
        var YTurl = YouTube.value.replace("https://youtube.com/shorts/","");
        var YTurl2 = YTurl.replace("?feature =share","");
        document.querySelector('.idList').value = YTurl2;
        Music();
    }
    else{
        alert('Introduce Tu URL');
    }
}

// Función que maneja la descarga de música
function Music() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2b929025ddmshd3302ab633a818cp1ab4cdjsne14ca95e2a8d',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    };
    var urlLink = 'https://youtube-mp36.p.rapidapi.com/dl?id='+idList.value;
    
    fetch(urlLink, options).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        
        // Ocultar el spinner cuando se recibe la respuesta
        document.getElementById('loading').style.display = 'none';
        
        hidden.classList.add('active');
        document.querySelector('.form-control').value = data.link;
    }).catch(err => {
        // En caso de error, también se oculta el spinner
        document.getElementById('loading').style.display = 'none';
        console.error(err);
    })
}

var url = document.querySelector('.form-control');

// Función para descargar el MP3
// Función para descargar el MP3
function download() {
    const videoId = idList.value; // Asegurar que el ID del video está bien capturado
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Obtener título real desde la API antes de guardar en el historial
    const urlLink = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;

    fetch(urlLink, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2b929025ddmshd3302ab633a818cp1ab4cdjsne14ca95e2a8d',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data || !data.title) {
            alert("No se pudo obtener el título del video.");
            return;
        }

        const nuevaDescarga = {
            title: data.title,  // Ahora guarda el título real
            thumbnail: thumbnail,
            duration: data.duration || "Desconocida",
            size: data.filesize || "Desconocido"
        };

        // Obtener historial existente
        let historial = JSON.parse(localStorage.getItem("historialDescargas")) || [];

        // Agregar nueva descarga al historial
        historial.push(nuevaDescarga);

        // Guardar en localStorage
        localStorage.setItem("historialDescargas", JSON.stringify(historial));

        // Descargar archivo
        const anchor = document.createElement("a");
        anchor.href = data.link;
        anchor.download = data.title + ".mp3"; // Usa el título real
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        alert('Descargando MP3...');
    })
    .catch(err => {
        console.error("Error al obtener los datos del video:", err);
        alert("Hubo un problema al procesar la descarga.");
    });
}


// Seleccionamos los elementos
const openBtn = document.getElementById('openBtn');
const sidebar = document.getElementById('sidebar');

// Cuando se haga clic en el botón, se abrirá o cerrará la barra lateral
openBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

