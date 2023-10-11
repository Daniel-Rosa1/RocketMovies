const AppError = require("../utils/appError");
const knex = require("../database/knex")
const {hash, compare} = require("bcryptjs");

class UsersController {

    async create(request, response){
        const {name, email, password} = request.body


        const checkUserExist = await knex("users").where({email}).first()
        
        if(checkUserExist){
            throw new AppError("Este e-mail já esta em uso!")
        }

        const hashdPassword = await hash(password, 8)

        await knex("users").insert({
            name,
            email,
            password: hashdPassword
        }) 
       
        response.status(201).json()
    }

    async update(request, response){
        const {name, email, password, old_password} = request.body
        const {id} = request.params

        const user = await knex("users").where({ id }).first()
        if(!user){
            throw new AppError("Usuário não encontrado.")
        }

        const userWithUpdatedEmail = await knex("users").where({email: email}).first()

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este e-mail já esta em uso")
        }

        if(password && !old_password){
            throw new AppError("Você precisa informar a senha antiga")
        }
        if(!password && old_password){
            throw new AppError("Você precisa informar a senha nova")
        }
        
        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)
            if(!checkOldPassword){
                throw new AppError("A senha informada não corresponde com a senha antiga")
            }
           user.password = await hash(password, 8)
        }
    
        user.name = name ?? user.name
        user.email = email ?? user.email

        await knex("users").update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: knex.fn.now()
        }).where({id})

        response.json()

    }
}

module.exports = UsersController;