import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import profesoresRoutes from './routes/profesores.routes.js';
import verificarToken from './middlewares/auth.middleware.js';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();


app.use(cors({ origin: 'http://localhost:4200' })); 
app.use(express.json());

// Rutas
app.use('/api/profesores', verificarToken, profesoresRoutes);

// Servir archivos estáticos de Angular
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Render Angular Universal
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Inicia el servidor
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

export const reqHandler = createNodeRequestHandler(app);
