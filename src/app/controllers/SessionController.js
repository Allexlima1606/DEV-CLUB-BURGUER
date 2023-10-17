import * as Yup from 'yup'
import User from '../models/User'

class SessionController {
  async store(required, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    if (!(await schema.isValid(required.body))) {
      return response
        .status(400)
        .json({ error: 'Make sure your data is correct' })
    }

    const { email, password } = required.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      return response.status(401).json({ error: 'User does not exist' })
    }

    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: 'User or Password incorrect' })
    }

    const { id, name, admin } = user

    return response.json({
      user: {
        id,
        name,
        email,
        admin,
      },
    })
  }
}

export default new SessionController()
