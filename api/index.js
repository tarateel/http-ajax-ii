const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const uuid = require("uuid")
const jwt = require("jsonwebtoken")
const httpError = require("http-errors")
// const db = require("./db")
const auth = require("./auth")

const db = {
	users: [
		{
			id: "a90c0f03-28d9-4c4a-a6b5-90239fb2d674",
			name: "Jane Doe",
			email: "jane@doe.com",
			password: "abc123",
		},
		{
			id: "0bace3c4-0062-48b4-bd54-c1b7970e654e",
			name: "John Doe",
			email: "john@doe.com",
			password: "abc123",
		},
	],
}

const app = express()
const port = 8080
const host = "0.0.0.0"

app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res, next) => {
	res.json({
		message: "Welcome",
	})
})

app.post("/signup", (req, res, next) => {
	if (!req.body.name || !req.body.email || !req.body.password) {
		return next(httpError(400, "Need to send a name, email, and password!"))
	}

	// const data = db.read()

	if (db.users.find((v) => v.email === req.body.email)) {
		return next(httpError(409, "Email is already used!"))
	}

	const user = {
		id: uuid.v4(),
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	}

	db.users = db.users.concat(user)
	// db.write(db)

	res.status(201).json({
		token: auth.generateToken(user.id),
	})
})

app.post("/signin", (req, res, next) => {
	const authErr = httpError(401, "Invalid email or password!")

	if (!req.body.email || !req.body.password) {
		return next(authErr)
	}

	// const data = db.read()
	const user = db.users.find((v) => v.email === req.body.email)

	if (!user || user.password !== req.body.password) {
		return next(authErr)
	}

	res.json({
		token: auth.generateToken(user.id),
	})
})

app.get("/me", auth.authMiddleware(), (req, res, next) => {
	// const data = db.read()
	const { password, ...user } = db.users.find((v) => v.id === req.userId)

	// delete user.password

	res.json(user)
})

app.get("/users", auth.authMiddleware(), (req, res, next) => {
	// const data = db.read()
	res.json(db.users.map(({ password, ...rest }) => rest))
})

app.get("/users/:id", auth.authMiddleware(), (req, res, next) => {
	res.json(db.users.find((user) => user.id === req.params.id))
})

app.put("/users/:id", auth.authMiddleware(), (req, res, next) => {
	if (!req.body.name || !req.body.email) {
		return next(httpError(400, "Need to send a name and email!"))
	}

	const index = db.users.findIndex((user) => user.id === req.params.id)
	const user = db.users[index]

	db.users[index] = {
		...req.body,
		password: user.password,
	}

	res.json(req.body)
})

app.delete("/users/:id", auth.authMiddleware(), (req, res, next) => {
	db.users = db.users.filter((user) => user.id !== req.params.id)

	res.json({
		success: true,
	})
})

app.use((err, req, res, next) => {
	if (err.expose) {
		res.status(err.statusCode).json({
			message: err.message,
		})
	} else {
		console.log("Error:", err)

		res.status(500).json({
			message: "An unknown error occurred",
		})
	}
})

app.listen(port, host, () => {
	console.log(`=> Server running at http://localhost:${port}`)
})
