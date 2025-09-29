🔹 1. Crear el proyecto con Vite + React + TypeScript
npm create vite@4.3 music_player_v3 -- --template react-ts


📌 Esto te instala React 18.2, Vite 4.3 y TypeScript 5.0 (compatible).

🔹 2. Entrar a la carpeta del proyecto
cd music_player_v3

🔹 3. Instalar dependencias
npm install

🔹 4. Instalar TailwindCSS + PostCSS + Autoprefixer
npm install -D tailwindcss@3.3 postcss autoprefixer

🔹 5. Inicializar configuración de Tailwind
npx tailwindcss init 


Esto debe crear:

tailwind.config.cjs

🔹 6. Instalar Lucide React
npm install lucide-react@0.263

🔹 7. Configurar Tailwind en src/index.css

Abre src/index.css y reemplaza con esto:

@tailwind base;
@tailwind components;
@tailwind utilities;

🔹 8. Instalar mas librerias necesarias
npm install --save-dev @types/react @types/react-dom


🔹 9. desplegar
npm run dev
