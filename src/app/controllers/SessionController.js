import * as Yup from 'yup'
import User from '../models/User'

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Make sure your data is correct' })
    }

    const { email, password } = req.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ error: 'User does not exist' })
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'User or Password incorrect' })
    }

    const { id, name, admin } = user

    return res.json({
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