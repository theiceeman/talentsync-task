import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";


export default class UserService {

  public async signup({ request, response }: HttpContextContract) {
    try {
      const data = request.body();

      let result = await User.create({
        email: data.email,
        password: data.password,
      });


      if (result !== null) {
        response.status(200).json({ data: "User created!" });
      } else {
        throw new Error("User creation failed!");
      }

    } catch (error) {
      response.status(400).json({
        data: error
      })
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      response.status(200).json({ data: token })
    } catch {
      response.status(400).json({ data: 'Invalid credentials!' })
    }
  }

  public async view({ response }: HttpContextContract) {
    try {
      let data = await User.query()

      response.status(200).json({ data });
    } catch (error) {
      response.status(400).json({ data: error.message });
    }
  }

}


