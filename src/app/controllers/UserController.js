import { v4 } from "uuid";
import * as Yup from "yup";

import User from "../models/User";

class UserController{
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password_hast: Yup.string().required().min(6),
            admin: Yup.boolean(),
         })
         await schema.isValid(request.body)
        const { name, email, password_hast,admin } = request.body

        const user = await User.create({
            id: v4(),
            name,
            email,
            password_hast,
            admin,
        })

        return response.status(201).json({ id: user.id, name, email, admin})
    }
}

export default new UserController()