import React, { useState, useEffect } from "react"
import api from "../utils/api"

function UserUpdate(props) {
	const [user, setUser] = useState({
		id: "",
		name: "",
		email: "",
	})

	useEffect(() => {
		api().get(`/users/${props.match.params.id}`)
			.then(result => {
				setUser(result.data)
			})
			.catch(error => {
				console.log(error)
			})
	}, [props.match.params.id])

	const handleChange = (event) => {
		setUser({
			...user,
			[event.target.name]: event.target.value,
		})
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		
		api().put(`/users/${user.id}`, user)
			.then(result => {
				props.history.push("/users")
			})
			.catch(error => {
				console.log(error)
			})
	}

	return (
		<>
			<h1>Update User</h1>

			<form onSubmit={handleSubmit}>
				<input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} />
				<input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} />

				<button type="submit">Save</button>
			</form>
		</>
	)
}

export default UserUpdate