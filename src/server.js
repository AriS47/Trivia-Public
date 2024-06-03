

const express = require('express'); //Ensure our express framework has been added
const app = express();
const session = require('express-session');

var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
var gameplay = require('./resources/javascript/gameplay');

const path = require('path');
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
const axios = require('axios');
const qs = require('query-string');
const { response, request } = require('express');
var pgp = require('pg-promise')();


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: 'trivia_db',
	user:  'postgres',
	password: 'pwd'
};

const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

if (isProduction) {
	pgp.pg.defaults.ssl = {rejectUnauthorized: false};
  }

  const db = pgp(dbConfig);


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

/* caesarCipher - Password hash function
 * Takes the password, converts each character to its ascii code, increments by 1, then converts back to a char
 * @param pwd - plain text password string
 * @return hash - Hashed password
*/
function caesarCipher(pwd){
	hash = '';
	for(let i = 0; i < pwd.length; i++){
		hash += String.fromCharCode((pwd.charCodeAt(i) + 1));
		console.log('output', hash)

	}
	return hash;
}

// Default (Homepage) render
app.get('/', function(req, res) {
	var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
	req.session.category = null;
	req.session.difficulty = null;
	db.task('get-everything', task => {
		return task.batch([
			task.any(select_board)
		]);
	}).then(info => {
			res.render('../src/views/homepage',{
				data: info[0],
				local_css:"login.css",
				my_title:"Leaderboard",
				categories_list: gameplay.sumList,
				session: req.session
			});
		});
});


// Login Page render
app.get('/login', function(req, res) {
	var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
	req.session.category = null;
	req.session.difficulty = null;

	db.task('get-everything', task => {
		return task.batch([
			task.any(select_board)
		]);
	}).then(info => {
	res.render('../src/views/login',{
		data: info[0],
		local_css:"login.css",
		my_title:"Login",
		categories_list: gameplay.sumList,
		session: req.session
	});
})
});

// Logout Page render
app.get('/logout', function(req, res) {
	var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
	req.session.category = null;
	req.session.difficulty = null;

	db.task('get-everything', task => {
		return task.batch([
			task.any(select_board)
		]);
	}).then(data => {
	res.render('../src/views/logout',{
		data: data[0],
		local_css:"login.css",
		my_title:"Logout",
		categories_list: gameplay.sumList,
		session: req.session
	});
})
});


/* app.get('/register', function(req, res) {
	res.render('../src/views/register',{
		local_css:"login.css",
		my_title:"Register",
		session: req.session
	});
}); */

// Gameplay page render
app.get('/gameplay', function(req, res) {
	var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
	db.task('get-everything', task => {
		return task.batch([
			task.any(select_board)
		]);
	}).then(info => {
		res.render('../src/views/gameplay',{
			data: info[0],
			local_css:"login.css",
			my_title:"Gameplay",
			categories_list: gameplay.sumList,
			items: '',
			responses: '',
			popup: '',
			session: req.session,
			username: req.session.username
		});
	});
});

// Leadboard display on multiple pages implementation:
app.get('/leaderboard', function(req, res) {
	var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
	req.session.category = null;
	req.session.difficulty = null;

	db.task('get-everything', task => {
		return task.batch([
			task.any(select_board)
		]);
	}).then(info => {
			res.render('../src/views/leaderboard',{
				data: info[0],
				local_css:"login.css",
				my_title:"Leaderboard",
				categories_list: gameplay.sumList,
				session: req.session
			});
		});
});

// Loads the profile page
app.get('/profile', function(req,res){
	var stats = `SELECT * FROM leader_board where user_name = '${req.session.username}';`
	var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
	req.session.category = null;
	req.session.difficulty = null;


	db.task('get-everything', task => {
		return task.batch([
			task.any(stats),
			task.any(select_board)
		]);
	})
	.then(data => {

		console.log(data[0][0].games_played)
		console.log(data.games_played)
		console.log(data[0])


	res.render('../src/views/profile',{

		stats: data[0][0],
		data: data[1],

		local_css: 'login.css',
		my_title: 'Profile',
		session: req.session,
		categories_list: gameplay.sumList
	});
});
});
/* Post for getting categories loaded to gameplay */
app.post('/get_cat', function(req, res) {
	

	var cat = req.body.catSelect; /* The selected category */
	var diff = req.body.difSelect; /* The selected difficulty */
	var id = ''; /* The category id */

	req.session.category = cat;
	req.session.difficulty = diff;
	//Loops through the categories list to get the id of the select category
	if(cat != "Random"){
		var match = false; /* Boolean to check if the category has been matched to an id*/
		//loop runs until end of list or a match is found, whichever comes first
		for(let i = 0; i < gameplay.categories.length && match == false; i++){
			if(cat == gameplay.categories[i].category){ /* If the selected category matches the category in the list: */
				id = gameplay.categories[i].id; /* id parameter is assigned the value of the category's id */
				match = true; /* A match has been found, so the loop will stop */
			}
		}
	}

	if(diff == "random"){
		diff = '';
	}

	if(cat) {
	  axios({
		  url: `https://opentdb.com/api.php?amount=1&category=${id}&difficulty=${diff}`,
		  method: 'GET',
		  dataType:'json',
		}).then(items => {


			console.log(items.data.results);
			var responses = gameplay.answers(items.data.results[0].correct_answer,items.data.results[0].incorrect_answers);/* Shuffles the answers */
			gameplay.rightAnswer = items.data.results[0].correct_answer; /* Tracks the right answer */
			gameplay.selectedDiff = items.data.results[0].difficulty; /* Tracks the selected difficulty */
			items.data.results[0].question = gameplay.cleanup(items.data.results[0].question); /* Removes un-renderable characters from the question */
			for(let i = 0; i < responses.length; i++){ /* Removes un-renderable characters from the answers */
				cleanedUp = gameplay.cleanup(responses[i]);
				responses[i] = cleanedUp;
			}

			var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
			db.task('get-everything', task => {
				return task.batch([
					task.any(select_board)
				]);
			}).then(data => {


			res.render('../src/views/gameplay',{

			  items: items.data.results,
			  data: data[0],
			  local_css:"login.css",
			  my_title:"Gameplay",
			  categories_list: gameplay.sumList,
			  responses: responses,
			  popup:'',
			  session: req.session
			})
				})



		  })
		  .catch(error => {
			console.log(error);
			res.render('../src/views/gameplay',{
				items: items.data.results,
				local_css:"login.css",
				my_title:"Gameplay",
				categories_list: gameplay.sumList,
				responses: '',
				session: req.session
			})
		  });
	}
});


/* Gets answers from question and finds which answer is correct */
app.post('/get_ans', function(req, res) {

	var ans = req.body.answer;
	var query = '';
	var popup = '';
	console.log(req.body);
	console.log(ans);

	if(gameplay.selectedDiff == 'easy'){
		var diff_update = `UPDATE leader_board SET easy_ans = easy_ans + 1 WHERE user_name = '${req.session.username}';`;
	}
	if(gameplay.selectedDiff == 'medium'){
		var diff_update = `UPDATE leader_board SET med_ans = med_ans + 1 WHERE user_name = '${req.session.username}';`;
	}
	if(gameplay.selectedDiff == 'hard'){
		var diff_update = `UPDATE leader_board SET hard_ans = hard_ans + 1 WHERE user_name = '${req.session.username}';`;
	}



	if(ans == gameplay.rightAnswer){
		console.log('You guessed right!');
		popup = 'right';
		var multiplier = gameplay.multiplier(gameplay.selectedDiff);
		console.log('The multiplier is:', multiplier);
		query = `UPDATE leader_board SET wins = wins + 1,
				games_played = games_played + 1,
				points = points +
				${multiplier} WHERE user_name = '${req.session.username}';`;
	}
	else{
		console.log('You guessed wrong :(');
		popup = 'wrong';
		query = `UPDATE leader_board SET games_played = games_played + 1 WHERE user_name = '${req.session.username}';`;
	}
	var select_board = 'SELECT * FROM leader_board ORDER BY score DESC limit 10;';
	db.task('get-everything', task => {
		return task.batch([
			task.any(query),
			task.any(select_board),
			task.any(diff_update)
		]);
	}).then(data => {

		res.render('../src/views/gameplay',{
			data: data[1],
			items: '',
			local_css:"gameplay.css",
			my_title:"Gameplay",
			categories_list: gameplay.sumList,
			responses: '',
			popup: popup,
			session: req.session
		})
	})
	.catch(function(err){
		res.render('../src/views/gameplay',{
			items: '',
			local_css:"gameplay.css",
			my_title:"Gameplay",
			categories_list: gameplay.sumList,
			responses: '',
			popup: '',
			session: req.session
		})
	})
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	request.session.category = null;
	request.session.difficulty = null;
	var caesarPassword = caesarCipher(password);
	console.log(caesarPassword);


	// Ensure the input fields exists and are not empty
	if (username && password) {
		console.log(username)
		console.log('DADADADADAD')
		var log_query = `SELECT first_name, last_name FROM login_info WHERE user_name = '${username}' AND pass_word = '${caesarPassword}';`
		db.any(log_query).then(function(logs){

			if(logs.length > 0){
				request.session.loggedin = true;
				request.session.username = username;
				request.session.firstname = logs[0].first_name;
				request.session.lastname = logs[0].last_name;
				response.redirect('/');

			}
			else{
				response.redirect('/login');
			}
			response.end();




		})


	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

/* Registers a new user */
app.post('/reg', function(req,res) {
	let username = req.body.r_username;
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let password = req.body.r_password;
	req.session.category = null;
	req.session.difficulty = null;
	var caesarPassword = caesarCipher(password);
	console.log(caesarPassword);

	console.log(username);
	var leader_reg = `INSERT INTO leader_board(user_name, wins, games_played, points, easy_ans, med_ans, hard_ans) VALUES ('${username}', 0, 0, 0,0,0,0);`
	var register = `INSERT INTO login_info(user_name, pass_word, first_name, last_name, created_on) VALUES('${username}', '${caesarPassword}', '${firstname}', '${lastname}', NOW());`
	var check = `Select * from login_info where user_name = '${username}' and pass_word = '${caesarPassword}';`
	if(username && password){
		db.any(check).then(function(results){
			if(results.length > 0){
				res.send('Username already associated! Please go back');
				res.end()
			}
			else{
				db.any(register);
				db.any(leader_reg);
				db.any(check).then(function(result){
					if(result.length > 0){
						req.session.loggedin = true;
						req.session.username = username;
						req.session.firstname = firstname;
						res.redirect('/');
					}
					else{

						res.redirect('/login');
					}
					res.end()
				})

			}
		})
	}
	else {
		res.send('Please enter Username and Password!');
		res.end();
	}


});


/* Logs out current user */
app.post('/logout', function(req,res){
	req.session.loggedin = false;
	req.session.username = null;
	req.session.firstname = null;
	req.session.category = null;
	req.session.difficulty = null;



	res.redirect('/');
})

// Redirect function
app.post('/back_to_home', function(req,res){

	res.redirect('/');
});

module.exports = app;

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
