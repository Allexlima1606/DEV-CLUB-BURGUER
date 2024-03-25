import * as Yup from 'yup'
import User from '../models/User'
import { v4 } from 'uuid'

class UserController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
        admin: Yup.boolean(),
      })

      if (!(await schema.isValid(request.body))) {
        return response
          .status(400)
          .json({ error: 'Make sure your data is correct' })
      }
      const { name, email, password, admin } = request.body

      const userExists = await User.findOne({
        where: { email },
      })

      if (userExists) {
        return response.status(409).json({ error: 'User already exists' })
      }

      const user = {
        id: v4(),
        name,
        email,
        password,
        admin,
      }

      await User.create(user)

      return response.json({ id: user.id, name, email, admin })
    } catch (err) {
      return response.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default new UserController()
