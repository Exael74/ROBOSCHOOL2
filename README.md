# RoboSchool — Landing page

Landing page del proyecto estudiantil **RoboSchool**: un robot móvil de carga asistida.

Sitio estático (HTML/CSS/JS, sin build ni dependencias) listo para publicarse con **GitHub Pages**.

## Estructura

```
index.html          página principal
assets/style.css     estilos y animaciones
assets/script.js      animación del contador de estadísticas
assets/robot.png      imagen del robot (hero)
.nojekyll             evita que GitHub Pages procese el sitio con Jekyll
project/              bundle original exportado de Claude Design (referencia, no se despliega)
```

## Ver el sitio en local

Como no usa ningún framework ni build, basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
# o
python -m http.server 8080
```

## Publicar con GitHub Pages

1. Sube este proyecto a un repositorio en GitHub (la carpeta `project/` puede subirse también, no interfiere).
2. En el repositorio: **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama (p. ej. `main`) y la carpeta **/ (root)**.
5. Guarda. GitHub publicará el sitio en `https://<usuario>.github.io/<repositorio>/` en unos minutos.

No hace falta ningún workflow de GitHub Actions: al ser HTML/CSS/JS puro, no hay paso de compilación.
