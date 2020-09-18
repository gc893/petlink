import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import authService from '../../services/authService';
import Users from '../Users/Users';
import './App.css';
import AddPet from '../../components/AddPet/AddPet';
import * as petAPI from '../../services/petService';

class App extends Component {
	state = {
		user: authService.getUser(),
		pets: [],
	};

	handleLogout = () => {
		authService.logout();
		this.setState({ user: null });
	};

	handleSignupOrLogin = () => {
		this.setState({ user: authService.getUser() });
	};

	handleAddPet = async (newPetData) => {
		const newPet = await petAPI.create(newPetData);
		newPet.addedBy = this.state.user._id;
		this.setState(
			(state) => ({
				pets: [...state.pets, newPet],
			}),
			() => this.props.history.push('/')
		);
	};

	render() {
		const { user } = this.state;
		return (
			<>
				<NavBar user={user} handleLogout={this.handleLogout} />
				<Route
					exact
					path="/"
					render={() => (
						//  change to render LandingPage component
						<main>
							<h1>Landing page</h1>
						</main>
					)}
				/>
				<Route
					exact
					path="/signup"
					render={({ history }) => (
						<Signup
							history={history}
							handleSignupOrLogin={this.handleSignupOrLogin}
						/>
					)}
				/>
				<Route
					exact
					path="/login"
					render={({ history }) => (
						<Login
							history={history}
							handleSignupOrLogin={this.handleSignupOrLogin}
						/>
					)}
				/>
				<Route
					exact
					path="/users"
					render={() => (user ? <Users /> : <Redirect to="/login" />)}
				/>
				<Route
					exact
					path="/pets/add"
					render={() => (
						<AddPet
							user={this.state.user}
							handleAddTodo={this.handleAddPet}
						/>
					)}
				/>
			</>
		);
	}
}

export default App;
