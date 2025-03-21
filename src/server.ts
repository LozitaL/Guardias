import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; 
import verificarToken from './middleware/auth.middleware.js'; 
import profesoresRoutes from './routes/profesores.routes.js';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 15, 
  message: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.',
});

app.use(cors({ origin: 'http://localhost:4200' })); 
app.use(express.json({ limit: '10kb' }));
app.use(limiter); 


app.use('/api/profesores', verificarToken, profesoresRoutes);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Iniciar el servidor
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Servidor Node escuchando en http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
