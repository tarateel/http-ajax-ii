import React from "react"
import { Route, Redirect } from "react-router-dom"

function ProtectedRoute(props) {
	// We are essentially duplicating "props" here,
	// but excluding the value of "component".
	const { component: Component, ...rest } = props

	return (
		// Since we can't have both a "component" and a "render" prop,
		// use our copy of props without "component"
		<Route
			{...rest}
			render={(renderProps) => {
				// Use a render prop so our component is computed,
				// allowing our token value to be set and deleted over time
				if (localStorage.getItem("token")) {
					// We are logged in, so render the component as normal
					// Passing "renderProps" so "Component" has access to all
					// the React Router stuff
					return <Component {...renderProps} />
				} else {
					// We are not logged in, so redirect to the signin page
					return <Redirect to="/signin" />
				}
			}}
		/>
	)
}

export default ProtectedRoute
