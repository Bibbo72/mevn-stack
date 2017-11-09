# Project

## About
This project is a full-stack Docker environment using the MEVN stack (MongoDB, ExpressJS, VueJS, Node). It also uses Redis, but MEVRN sounds stupid... and actually, so does MEVN. It's meant to exist as a micro framework and project scaffolding for developing small asynchronous Node applications.

## Why use a MEVN stack?
I guess we could call this a hipster stack, or a *hipstack*. VueJS is one of the hottest front-end frameworks right now, which means your job prospects are going to be better by learning it. It's gaining popularity due to it's easy learning curve, lightweight architecture, and excellent documentation.

The back-end REST API was built with the considerations of keeping Javascript as the common language and passing data as JSON objects. Express accepts HTTP requests in JSON, then calls Mongo for data which is also handled in JSON. This allows for a much easier communication medium between front and back end engineers.

This Docker setup also comes with a Redis container, which will shortly be integrated into the backend REST API as an LRU cache. You can run the project without it if you're just using it for small development projects. Just delete the 'cache' section from the *docker-compose.yml* file and remove the redis dependency from your API *package.json*.

## Dependencies
The only real dependencies for getting started with this project are [Docker](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/). Docker will containerize your development environment and install all of it's other dependencies for you.

Install the latest version on the environment of your choice. These containers were tested on Debian 9 Stretch. Docker kind of sucks on Windows because it requires Hyper-V, thus making virtualization (almost) unusable on hypervisors. It's recommended you use Linux for development with this project.

## Project Architecture

App -> Api -> Cache Server -> Database



---

# Docker

## Running the Docker Containers
In the project root, open a shell. Run the Docker daemon and run the app, api, and MongoDB containers with docker-compose. If this is your first time running this command, Docker will create the containers for you and install their dependencies.
```
service docker start && docker-compose up
```

## Spawn a TTY Bash Shell
In order to open a connection to your containers, list the containers, then run a bash shell into any one container.
```
docker ps -a
docker exec -it <container-name OR container-id> bash
```

## Shutting Down Docker Containers
[Nodemon](https://nodemon.io/) will watch for file changes in your API. To exit, Ctrl + C. Gracefully shut down the Docker containers.
```
docker-compose down
```

If you want to also remove the shared volumes
```
docker-compose down -v
```

---

# APP
## Front-End Development with VueJS
At the moment, the contents of the App folder is pretty much what you get when you install the Vue-Cli and generate a webpack template. But I don't have NPM installed on my host (and remember, Docker is the only dependency) so that package is the primary scaffold for the app section of this project, with a few extra additions:

* [VueX](https://github.com/vuejs/vuex) - State Management for Vue JS
* [Axios](https://github.com/axios/axios) - Promise based HTTP Client
* [Stylus](https://github.com/stylus/stylus) - CSS Preprocessor
* [Stylus-loaders](https://github.com/shama/stylus-loader) - Webpack Stylus Loaders
* [Pug](https://github.com/pugjs/pug) - HTML Templating Engine, Formerly known as Jade

## Workflow

**DOCUMENTATION COMING SOON**


---

# API
## Back-End Development with ExpressJS
No one ever likes playing support. But every raid party knows how valuable the healer is.

Luckily, this API is easy to work with and, dare I say, it can be *fun*. At the moment, there are a few components you'll have to roll out yourself. However, this web server has already been configured with authentication mechanisms, password hashing, basic protection against a few anti-security techniques, server side validation, and an ORM for database calls to Mongo. Just add endpoints and you're set. Easy right?

This server is meant to be as flexible and modular as possible. You should be able to easily implement your own dependencies and middleware into the architecture without breaking it's core functions. It's very beginner friendly due to it's simplicity and a decent introduction into API development.

## Dependencies
* [Express](https://github.com/expressjs/express) - Node Server Framework
* [Mongoose](https://github.com/Automattic/mongoose) - MongoDB ORM
* [Morgan](https://github.com/expressjs/morgan) - HTTP Logger
* [Bcrypt](https://github.com/dcodeIO/bcrypt.js) - Password Hashing
* [Helmet](https://github.com/helmetjs/helmet) - Basic HTTP Security
* [Passport](https://github.com/jaredhanson/passport) - Authentication Middleware
* [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) - Authentication Token
* [Joi](https://github.com/hapijs/joi) - Validation Middleware

### Dev Dependencies
* [Webpack](https://github.com/webpack/webpack) - Web Stack Bundling
* [Babel](https://github.com/babel/babel) - ES6 Compiler
* [Mocha](https://github.com/mochajs/mocha) / [Chai](https://github.com/chaijs/chai) - Unit Testing

## Workflow
There's no better way to learn or teach than by example. Let's try setting up endpoints to handle requests for Blog posts from a front end application. But first...

### Getting started
Open a new shell and connect to the API
```
docker exec -it mevn_api bash
```

The server uses Webpack as the bundler (yes, server side bundling is okay). We'll use webpack to watch for changes in our *server.js* file and output it into one big (currently unminified) file in the */dist* directory. In your shell, start the watcher.
```
npm run watch
```

Webpack should now be watching for changes and Nodemon will restart the server everytime the bundling is complete. Let's begin.

### Models
First, we'll need to create a Post model. Models define the structure of a database object. In this example, you can define that a post contains a title, subtitle, and a body. Additionally, we will need timestamps and a slug for a readable URL.

Create a new Post model in the /models directory
```javascript
touch api/src/models/post.model.js
```

Define the schema for the model.

*api/src/models/post.model.js*
```javascript
// import mongoose
import mongoose from 'mongoose'

// post schema
const PostSchema = new Schema({
	slug: { type: String, required: true, unique: true, lowercase: true },
	title: { type: String, required: true, unique: true },
	subtitle: { type: String, required: true, unique: true, lowercase: true },
	body: { type: String, required: true }
},
{
	timestamps: true
})
```

Mongoose allows you to also perform logic on a database call before it's made. Let's create a function which generates a slug from the title before saving it to the database.

*api/src/models/post.model.js*
```javascript
// Before saving, generate a slug from the title
// 'this' refers to the current model
UserSchema.pre('save', async function(next) {
	try {
		const slug = this.title.replace(/\s/g, '-') // strip all whitespace and replace with dash
		this.slug = slug // assign the slug
		next()
	}
	catch(err) {
		next(err)
	}
})
```

Finally, at the end of the file, export the Post model.

*api/src/models/post.model.js*
```javascript
const post = mongoose.model('Post', PostSchema)
export default post
```

### Controllers
Now that we have our model, we need to build a controller to talk to the database with. Controllers handle the routing logic. Each individual controller imports an associated model, which gives it an instance of the Mongoose ORM. You can make calls to your database here using the model.

Controllers are named on the convention of object.controller.js

Create a new post controller in the controllers directory.
```
touch api/src/controllers/post.controller.js
```

Import the Post model, Express, and then create handlers for your HTTP methods.

*api/src/controllers/post.controller.js*
```javascript
// import instances of express and your post model
import express from 'express'
import Post from '../models/post.model'

export default {
	// return all posts
	index: async (req, res, next) => {
		try {
			// handle success
			const posts = await Post.find({}) // find all posts and assign it to posts
			res.status(200).json(posts) // respond with a 200 OK and list of posts
		}
		catch(err) {
			// handle error
			next(err)
		}
	},

	// return one post
	get: async (req, res, next) => {
		...
	},

	// save new post
	post: async (req, res, next) => {
		...
	},

	// update post
	put: async (req, res, next) => {
		...
	},

	// remove post
	delete: async (req, res, next) => {
		...
	}
}
```

### Routes
We'll need to set up RESTful routes in our API. Our route map will look something like this:
```
HTTP 	URI 				IT SHOULD

GET 	/posts 				return all posts 
POST 	/posts 				save post
GET 	/posts/:slug	 	get post
PUT 	/posts/:slug 		update post
DELETE 	/posts/:slug 		delete post
```

The routes.js file is a map of all the endpoints available in your API. All routes are stored onto a single routes.js in the API base. This is where you'll handle all HTTP requests to your API.

TIP: If you end up putting too much logic into this file, it may be better to create a routes folder in the project base and import your routes to this file.

*api/src/routes.js*
```javascript
router.route('/posts')
	.get(PostsController.index) 
	.post(PostsController.post)

router.route('/posts/:slug')
	.get(PostsController.get)
	.put(PostsController.put)
	.delete(PostsController.delete)
```

### Authentication
#### Validation
This API uses [Joi](https://github.com/hapijs/joi) for validating data sent to the API.

Let's create a new validation schema for our posts. Refer to the Joi API for more options.

*api/src/config/validation.js*
```javascript
schemas: {
	...,

	postSchema: joi.object().keys({
		title: joi.string().alphanum().required(),
		subtitle: joi.string().alphanum().required(),
		body: joi.string().required()
	})
}
```

Now import the Joi config to your routes folder. Alias the function and then add them to your POST and PUT routes. Any data passed onto the HTTP bodies to these routes will now be validated against your Joi schema.

*api/src/routes.js*
```javascript
// import Joi
import joi from './config/joi'

// alias
const joi_post = joi.validate(joi.schemas.postSchema)

// add them to routes
router.route('/posts')
	.get(PostsController.index) 
	.post(joi_post, PostsController.post)

router.route('/posts/:slug')
	.get(PostsController.get)
	.put(joi_Post, PostsController.put)
	.delete(PostsController.delete)
```

#### Authentication
This API uses [Passport](https://github.com/jaredhanson/passport) and [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) for authentication.

Although there is a heavy debate on JWT security, it's currently one of the only solutions for Node authentication and a bit of a necessary evil. Here, JWTs are stored onto the database and queried every time a user 'logs in' and 'logs out'. Since JWTs are suppose to be a stateless solution, the concepts of logins, logouts, and client side token storage make this a rather stateful implementation.

But it *works*, is **secure**, and that's what matters. Each token that is created has a copy of it stored onto the database, as well as a UUID matching it's associated user. These tokens can be invalidated, destroyed, and blacklisted. There can only be one valid token per user at all times.

To protect a few methods on our posts, we'll simply add the middleware instances to secure a few routes. In order to make changes to these posts, we need to be 'logged in' or rather, the server will require a JWT in order to view the resource.

*api/src/routes.js*
```javascript
router.route('/posts')
	.get(PostsController.index) 
	.post(joi_Post, passport_jwt, PostsController.post)

router.route('/posts/:slug')
	.get(PostsController.get)
	.put(joi_Post, passport_jwt, PostsController.put)
	.delete(passport_jwt, PostsController.delete)
```

#### Access Control List
At the moment, you will have to roll your own ACL. I'm currently working on an ACL implementation against a cache server.

### Unit Tests
**DOCUMENTATION COMING SOON**

### Integration Tests
**DOCUMENTATION COMING SOON**

## Security
**DOCUMENTATION COMING SOON**

---

# CACHE SERVER: REDIS
**DOCUMENTATION COMING SOON**

---

# DATABASE: MONGODB
**DOCUMENTATION COMING SOON**

---

# Caveats
* Creating files within a container will do so with root permissions, therefore you should generate files from your local environment
* The API container is using nodemon for server restarts on file changes, therefore you should use a second shell to execute bash shells from your containers.

## Upcoming Features
* Caching with Redis
* Access Control List for resource Authorization
* Refresh Token implementation
* Password Resets
* Mail server
* Production environment configurations
* Database seeding
* API Hot module replacement and Live Reloading