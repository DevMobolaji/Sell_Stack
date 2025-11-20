import 'dotenv/config';
import App from "@/core/app";
import AuthController from "@/domain/auth/auth.controller";
import validateEnvVariables from "@/configs/validateEnv"

validateEnvVariables();

const app = new App([new AuthController()], Number(process.env.PORT))

const start = async () => {
     app.listen()
}

start ()