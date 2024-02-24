import express from 'express';
import path from 'path';

interface Options {
  port:number;
  public_path?: string;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath:string;

  constructor(options:Options){

    const {port,public_path= 'public' } = options;
    this.port=port;
    this.publicPath=public_path;
  }

  async start() {
    //*Middlewares
    //*Public Folder
    this.app.use(express.static(this.publicPath));

    //esto sirve para que en este caso, react (aunque podria ser otra tecnologia)
    //vuelva a tomar el control y no se rompa cuando actualizas dentro de
    //alguna ruta manejada por el front
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
      return;
    });

    this.app.listen(this.port, () => {
      console.log(`Server running on port 3000`);
    });
  }
}
