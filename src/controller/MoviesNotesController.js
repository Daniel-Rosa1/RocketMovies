const knex = require("../database/knex")

class MovieNotesController{

	async create(request, response){
		const {title, description, rating, tags} = request.body
		const {user_id} = request.query

		const [note_id] = await knex("notes").insert({
			title,
			description,
			rating,
			user_id
		}) 
 
		 const tagsInsert = tags.map(tagName =>{
			return {
				note_id,
				user_id,
				name: tagName
			}
		}); 

		await knex("tags").insert(tagsInsert)

		response.status(201).json()
	}

	async show(request, response){
		const {id} = request.query

		const movieNotes = await knex("notes").where({id}).first()
		const movieTags = await knex("tags").where({user_id:id}).orderBy("name")

		console.log(id)
		console.log(movieTags)

		response.json({
			...movieNotes,
			movieTags
		})
	}

	async delete(request, response){
		const {id} = request.query
		await knex("notes").where({id}).delete()

		response.json()
	}

	async index(request, response){
		const {user_id,title, tags} = request.query
		let notes;


		if(tags){
			const filterTags = tags.split(",").map(tag => tag.trim())

			notes = await knex("tags")
			.select([
				"notes.id",
				"notes.title",
				"notes.user_id"
			])
			.where("notes.user_id", user_id)
			.whereLike("notes.title", `%${title}%`)
			.whereIn("name", filterTags)
			.innerJoin("notes", "notes.id", "tags.note_id")
			.orderBy("notes.title")
		}else{            
			notes = await knex("notes")
			.where({user_id})
			.whereLike("title", `%${title}%`)
		}

		const userTags = await knex("tags").where({user_id})
		const noteWithTags = notes.map(note =>{
			const noteTags = userTags.filter(tag => tag.note_id === note.id)
			const resposta = {
				...note,
				tags: noteTags
			}
			console.log(resposta)
			return resposta
		})

		response.json(noteWithTags)
	}

}

module.exports = MovieNotesController;