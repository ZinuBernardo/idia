import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5500,
    open: true
  },
  plugins: [
    ViteImageOptimizer({
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        instituto: resolve(__dirname, 'instituto.html'),
        humanoConcreto: resolve(__dirname, 'humano-concreto.html'),
        areasEstrategicas: resolve(__dirname, 'areas-estrategicas.html'),
        centros: resolve(__dirname, 'centros.html'),
        projectos: resolve(__dirname, 'projectos.html'),
        investimento: resolve(__dirname, 'investimento.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        parcerias: resolve(__dirname, 'parcerias.html'),
        africaConcreta: resolve(__dirname, 'africa-concreta.html'),
        mahamba: resolve(__dirname, 'mahamba.html'),
        ideiaAfrica: resolve(__dirname, 'ideia-africa.html'),
        ideiaGlobal: resolve(__dirname, 'ideia-global.html'),
        travessia: resolve(__dirname, 'travessia-continentes.html'),
        noticias: resolve(__dirname, 'noticias.html'),
        publicacoes: resolve(__dirname, 'publicacoes.html'),
        oLivroOFilme: resolve(__dirname, 'o-livro-o-filme.html'),
        museu: resolve(__dirname, 'museu.html'),
        sobreNos: resolve(__dirname, 'sobre-nos.html'),
      }
    }
  }
});
