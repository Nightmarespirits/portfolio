import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Si tu repositorio no se llama <tu-usuario>.github.io (por ejemplo, si se llama "mi-cv"), 
  // descomenta la siguiente línea y reemplaza con el nombre de tu repositorio:
  // basePath: '/mi-cv',
  images: {
    unoptimized: true, // Importante para GitHub Pages ya que no tiene un servidor para optimizar imágenes
  }
};

export default nextConfig;
