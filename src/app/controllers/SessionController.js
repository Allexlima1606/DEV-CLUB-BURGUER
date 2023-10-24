import * as Yup from 'yup'
import Jwt from 'jsonwebtoken'
import User from '../models/User'
import authConfig from '../../config/auth'

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Make sure your data is correct' })
    }

    const { email, password } = request.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      return response.status(401).json({ error: 'User does not exist' })
    }

    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: 'User or Password incorrect' })
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: Jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
