import 'dotenv/config';
import App from './core/app';
import AuthController from "@/domain/auth/auth.controller";


const app = new App([new AuthController()], Number(3000))

const start = async () => {
     app.listen()
}

start ()