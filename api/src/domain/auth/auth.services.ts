import User from "domain/auth/auth.model"
import HttpException from "@/core/errors/restFulError/http.exception";
import AuditLogger  from "domain/audit/audit.service";
import { hashedPassword, verifyPassword } from "@/config/password";

class userService {

    private user = User
    public async Register(name: string, email: string, password: string, ip?: string, userAgent?: string) {
        const alreadyExist = await this.user.findOne({ email })

        if (alreadyExist) {
            await AuditLogger.logEvent({
                userId: "",
                action: "USER_REGISTER_ATTEMPT",
                status: "DUPLICATE_EMAIL",
                ip: ip,
                userAgent: userAgent,
                metadata: { email: email }

            })
            throw new HttpException("Registration received. If the email exists an email was sent.")
        }

        const pass = hashedPassword(password)
        const user = await User.create({
            name,
            email,
            pass
        })
        
        return {
            user
        }
    }


}

export default userService; 