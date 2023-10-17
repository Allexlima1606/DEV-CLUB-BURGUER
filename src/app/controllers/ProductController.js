import * as Yup from 'yup'
import Product from '../models/Product'
class ProductController {
  async store(required, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category: Yup.string().required(),
    })

    try {
      await schema.validateSync(required.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }
    const { filename: path } = required.file
    const { name, price, category } = required.body

    const product = await Product.create({
      name,
      price,
      category,
      path,
    })
    return response.json(product)
  }

  async index(required, response) {
    const products = await Product.findAll()

    return response.json(products)
  }
}

export default new ProductController()
