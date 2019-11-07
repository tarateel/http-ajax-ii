import axios from "axios"

// A helper function so we don't have to keep repeating this
export function getToken() {
	return localStorage.getItem("token")
}

// Create an axios helper with some predefined values
export default function() {
	return axios.create({
		baseURL: "http://localhost:8080",
		headers: {
			Authorization: getToken(),
		},
	})
}
