const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://test:PvEUrtFRmQXoojht@ocbackenddatabase-ik6qq.mongodb.net/test?retryWrites=true&w=majority')
.then(() => {
	console.log("successfully connected to the recipes database");
}).catch((error) => {
	console.log(error);
})

const Recipe = require('./models/recipe')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.get('/api/recipes/', (req, resp, next) => {
	Recipe.find()
	.then((recipes) => {
		resp.status(200).json(recipes);
	}).catch((error) => {
		resp.status(404).json({
			error: error
		});
	});

});

app.get('/api/recipes/:id', (req, resp, next) => {
	Recipe.findOne({
		_id: req.params.id
	}).then((recipe) => {
		resp.status(200).json(recipe);
	}).catch((error) => {
		resp.status(404).json({
			error: error
		});
	});
});

app.post('/api/recipes', (req, resp, next) => {
	const recipe = new Recipe({
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		difficulty: req.body.difficulty,
		time: req.body.time
	});

	recipe.save()
	.then(() => {
		resp.status(201).json({
			message: "Recipe added successfully!"
		});
	}).catch((error) => {
		resp.status(400).json({
			error: error
		});
	});
});

app.put('/api/recipes/:id', (req, resp, next) =>{
	const recipe = new Recipe({
		_id: req.params.id,
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		difficulty: req.body.difficulty,
		time: req.body.time
	});
	Recipe.updateOne({
		_id: req.params.id
	}, recipe).then(() => {
		resp.status(201).json({
			message: "Recipe updated successfully!"
		});
	}).catch((error) => {
		resp.status(400).json({
			error: error
		});
	});
});

app.delete('/api/recipes/:id', (req, resp, next) => {
	Recipe.deleteOne({
		_id: req.params.id
	}).then(() => {
		resp.status(200).json({
			message: "Recipe successfully deleted!"
		});
	}).catch((error) => {
		resp.status(400).json({
			error: error
		});
	});
});

module.exports = app;