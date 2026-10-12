/* ==========================================================================
   Keivampyx <3  |  script.js  (la parte que hace funcionar la subida de fotos)

   QUÉ HACE:
     Cada recuadro de foto (.photo) tiene un <input type="file"> invisible.
     Al elegir una imagen, este código la reduce de tamaño, la pone de fondo
     del recuadro y la guarda en el navegador para que siga ahí al recargar.

   IMPORTANTE:
     Las fotos se guardan solo en el navegador de quien las sube (localStorage).
     Otra persona que abra la página NO las verá. Para que todos las vean,
     sube las imágenes junto con la página y cambia el recuadro en index.html
     por una etiqueta <img src="mi-foto.jpg" alt="descripción">.
   ========================================================================== */

/* Todo va dentro de una función que se ejecuta sola para que las variables
   no se mezclen con otras del navegador. */
(function () {

  // Tamaño máximo (en píxeles) del lado más largo de la foto.
  // Se reduce para que no pese mucho y quepa en el almacenamiento del navegador.
  var MAX = 720;

  // Pone la imagen de fondo del recuadro y le agrega la clase "has".
  // La clase "has" cambia el borde a sólido y esconde el texto "+ foto" (ver style.css).
  function apply(label, url) {
    label.style.backgroundImage = 'url("' + url + '")';
    label.classList.add('has');
  }

  // Recorre todos los recuadros de foto de la página, uno por uno.
  document.querySelectorAll('.photo').forEach(function (label) {

    // Nombre con el que se guarda esta foto. Sale del data-slot del recuadro
    // en el HTML (por ejemplo data-slot="perfil" o data-slot="a1").
    // Cada recuadro debe tener un data-slot distinto o se pisarían las fotos.
    var key = 'diario-rosa-' + label.dataset.slot;

    // Al cargar la página: si ya hay una foto guardada para este recuadro, la muestra.
    // El try/catch evita que la página se rompa si el navegador bloquea el almacenamiento.
    try {
      var saved = localStorage.getItem(key);
      if (saved) apply(label, saved);
    } catch (e) {}

    // El <input type="file"> que está dentro del recuadro.
    var input = label.querySelector('input');

    // Se ejecuta cuando la persona elige una imagen.
    input.addEventListener('change', function () {
      var file = input.files && input.files[0]; // el archivo elegido
      if (!file) return;                        // si no eligió nada, no hace nada

      // Paso 1: leer el archivo como texto en formato data URL.
      var reader = new FileReader();
      reader.onload = function () {

        // Paso 2: cargar ese texto como una imagen para conocer su tamaño real.
        var img = new Image();
        img.onload = function () {

          // Paso 3: calcular cuánto hay que reducirla (nunca la agranda).
          var scale = Math.min(1, MAX / Math.max(img.width, img.height));

          // Paso 4: dibujarla en un canvas (un lienzo invisible) ya reducida.
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);

          // Paso 5: convertir el lienzo a JPG con calidad 82% (0.82).
          var url = c.toDataURL('image/jpeg', 0.82);

          // Paso 6: mostrarla en el recuadro y guardarla en el navegador.
          apply(label, url);
          try { localStorage.setItem(key, url); } catch (e) {}
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  });
})();
