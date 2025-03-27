import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AngularNodeAppEngine } from '@angular/ssr/node';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import authRouter from '../src/service/auth';  
import datosRouter from '../src/service/datos'; 

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();


app.use(cors({ 
  origin: 'http://localhost:4200', 
  credentials: true 
}));


app.use(bodyParser.json()); 

app.use('/api', datosRouter); 
app.use('/api', authRouter);


app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use('/**', (req, res, next) => {
  angularApp
    .handle(req) 
    .then((response) => {
      if (response) {
        res.send(response.body);  
      } else {
        next();
      }
    })
    .catch(next);
});
export const reqHandler = angularApp.handle;

const port = process.env['PORT'] ||4000;
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});

