const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const app = express();

const jsonParser = bodyParser.json();

let postsArray = [
	{
		id : uuid.v4(),
		title : "Article One",
		content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		author : "A guy",
		publishDate : new Date('2019-01-10T12:24:00')
	},
	{
		id : uuid.v4(),
		title : "Article One and a Half",
		content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		author : "A guy",
		publishDate : new Date('2019-02-10T12:24:00')
	},
	{
		id : uuid.v4(),
		title : "Article Two",
		content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." ,
		author : "Another dude",
		publishDate : new Date('2019-02-23T02:37:00')
	},
	{
		id : uuid.v4(),
		title : "Article Three",
		content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		author : "Some other guy",
		publishDate : new Date('2018-12-17T03:24:00')
	}
];

app.get('/blog-posts', (req, res) => {
	res.status(200).json({
		message : "Succesfully sent the list of blog posts",
		status : 200,
		posts : postsArray
	});
});

app.get('/blog-posts/:author', (req, res) => {
	let authorName = req.params.author;

	if(!authorName){
		res.status(406).json({
			message : "Error: missing arguments",
			status : 406
		});
		return;
	}

	let authorsPosts = [];
	postsArray.forEach( item => {
		if(item.author == authorName){
			authorsPosts.push(item);
		}
	});

	if(authorsPosts.length > 0){
		res.status(200).json({
			message : "Succesfully sent the list of author's posts",
			status: 200,
			posts : authorsPosts
		});
	}
	else{
		res.status(404).json({
			message : "Error: author not found",
			status : 404 
		});
	}
});

app.post('/blog-posts', jsonParser, (req, res) => {
	let postTitle = req.body.title; 
	let postContent = req.body.content;
	let postAuthor = req.body.author;
	let postDate = req.body.publishDate;

	if(postTitle == undefined || postTitle == "" 
		|| postContent == undefined || postContent == "" 
		|| postAuthor == undefined || postAuthor == "" 
		|| postDate == undefined || postDate == "") {
		res.status(406).json({
			message : "Error: Missing fields",
			status : 406,
		});	
		return;	
	}

	let newPost = {
		id : uuid.v4(),
		title : postTitle,
		content : postContent,
		author : postAuthor,
		publishDate : postDate
	};

	postsArray.push(newPost);

	res.status(201).json({
		message: "Succesfully posted Blog Post",
		status : 201,
		post : newPost
	});
});

app.delete('/blog-posts/:id', jsonParser, (req, res) => {
	let idPath = req.params.id;
	let idBody = req.body.id;

	//Validate that both params where received. Send error with status 406 "Missing fields"
	if(idBody == undefined || idBody != idPath){
		res.status(406).json({
			message : "Error: Missing fields or id not matching",
			status : 406,
		});	
		return;
	}

	//Validate that the id received is in the current array.
	let found = false;
	postsArray.forEach(item => {
		if(item.id == idPath){
			found = true;
		}
	});

	//If id is found, delete the item. Else throw error
	if(found){
		postsArray.forEach((item, index, object) => {
			if(item.id == idPath){
				object.splice(index, 1);	
			}
		});

		res.status(204).json({
			message : "Successfully deleted post",
			status : 204,
		});
	}else{
		res.status(404).json({
			message : "Error: ID doesn't exist",
			status : 404,
		});	
		return;
	}
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	let postId = req.params.id;
	let updateObj = req.body;

	if(!postId){
		res.status(406).json({
			message : "Error: missing id",
			status : 406
		});
		return;
	}

	if(updateObj == undefined 
		|| (updateObj.author == undefined
		 && updateObj.title == undefined
		 && updateObj.content == undefined
		 && updateObj.publishDate)){
		res.status(404).json({
			message : "Error: missing fields in body",
			status : 404
		});
		return;
	}

	postsArray.forEach( element => {
		if(element.id == postId){
			if(updateObj.title != undefined){
				element.title = updateObj.title;
			}

			if(updateObj.content != undefined){
				element.content = updateObj.Content;
			}

			if(updateObj.author != undefined){
				element.author = updateObj.author;
			}

			if(updateObj.publishDate != undefined){
				element.publishDate = updateObj.publishDate;
			}

			res.status(200).json({
				message : `Object ${postId} was updated`,
				status : 200,
				post : element
			});

			return;
		}
	});

	res.status(404).json({
		message : "Id not found",
		status : 404 
	});
});


app.listen(8080, () => {
	console.log('Your app is running in port 8080');
});