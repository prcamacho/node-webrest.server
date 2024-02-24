import express, { Router } from "express";
import path from "path";

interface Options {
  port: number;
  public_path?: string;
  routes: Router;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = "public" } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    //*Middlewares
    this.app.use(express.json());//raw
    this.app.use(express.urlencoded({ extended: true })); //x-www-form-urlencoded

    //*Public Folder
    this.app.use(express.static(this.publicPath));

    //*Routes

    this.app.use(this.routes);

    //esto sirve para que en este caso, react (aunque podria ser otra tecnologia)
    //vuelva a tomar el control y no se rompa cuando actualizas dentro de
    //alguna ruta manejada por el front
    //cualquier ruta no definida, pasa por aqui, ayuda a los spa
    this.app.get("*", (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
      return;
    });

    this.app.listen(this.port, () => {
      console.log(`Server running on port 3000`);
    });
  }
}
