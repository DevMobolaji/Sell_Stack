

import { Request, Response, Router } from "express"
import Controller from "@/interfaces/controller.interface"
import userService from "domain/auth/auth.services";
import asyncWrapper from "@/app/middleware/restMiddleware/asyncWrapper";



class AuthController implements Controller {
    public path = "/auth/V1";
    public route = Router();
    private userService = new userService();

    constructor() {
        this.initializeRoutes();
    }

    
    private register = asyncWrapper( async (req: Request, res: Response): Promise<Response | void> => {
        const { email, password, name, ip, userAgent } = req.body 
        const tk = await this.userService.Register(email, password, name, ip, userAgent);

        res.status(201).json({token: tk});
    })

    // private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    //     const { email, password } = req.body
    //     const tk = await userService.login(email, password);

    //     res.status(200).json({token: tk});
    // }







    //CONTROLLER ROUTES 
    private initializeRoutes(): void {
        this.route.post(`${this.path}/register`, this.register);
        // this.route.post(`${this.path}/login`, this.login);
    }

}

export default AuthController;