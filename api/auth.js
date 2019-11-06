const jwt = require("jsonwebtoken")
const httpError = require("http-errors")

const JWT_SECRET = "super-secret"

function generateToken(userId) {
	return jwt.sign({ id: userId }, JWT_SECRET)
}

function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET)
}

function authMiddleware() {
	return (req, res, next) => {
		const authErr = httpError(403, "Invalid authentication token")

		if (!req.headers.authorization) {
			return next(authErr)
		}

		try {
			const token = req.headers.authorization.replace(/^bearer /i, "")
			const decoded = verifyToken(token)

			if (!decoded.id) {
				return next(authErr)
			}

			req.userId = decoded.id
			next()
		} catch (err) {
			return next(authErr)
		}
	}
}

module.exports = {
	generateToken,
	verifyToken,
	authMiddleware,
}
