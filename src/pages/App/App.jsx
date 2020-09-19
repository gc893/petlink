import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import authService from '../../services/authService';
import Users from '../Users/Users';
import Pet from '../../pages/Pet/Pet';
import EditPet from '../../pages/EditPet/EditPet';
import './App.css';
import AddPet from '../../components/AddPet/AddPet';
import * as petAPI from '../../services/petService';
import * as userAPI from '../../services/userService'
import OwnerFeed from '../OwnerFeed/OwnerFeed';
import OwnerProfile from '../OwnerProfile/OwnerProfile';
import EditUser from '../EditUser/EditUser'
import LandingContent from '../../components/Landing/Landing';

class App extends Component {
	state = {
		user: authService.getUser(),
		pets: [],
		followedPets: [],
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

	handleUpdatePet = async (updatedPetData) => {
		const updatedPet = await petAPI.update(updatedPetData);
		const newPetsArray = this.state.pets.map((p) =>
			p._id === updatedPet._id ? updatedPet : p
		);
		this.setState({ pets: newPetsArray }, () =>
			this.props.history.push('/')
		);
	};

	handleUpdateUser = async (updatedUserData) => {
		const updatedUser = await userAPI.update(updatedUserData);
		console.log('update user', updatedUser)
		this.setState({ user: updatedUser }, () =>
			this.props.history.push('/')
		);
	};

	async componentDidMount() {
		const pets = await petAPI.getPets();
		// this needs to be fixed, once we have the follow pet feature.
		const followedPets = await petAPI.getPets(this.state.user.following);
		console.log('followed pets', this.state.user);
		this.setState({ pets, followedPets });
	}

	render() {
		const { user } = this.state;
		return (
			<>
				<NavBar user={user} handleLogout={this.handleLogout} />
				<div id="main-container">
					<Route
						exact
						path="/"
						render={() =>
							user ? (
								<div>
									<OwnerFeed
										user={this.state.user}
										followedPets={this.state.followedPets}
									/>
								</div>
							) : (
								<LandingContent />
							)
						}
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
						render={() =>
							user ? <Users /> : <Redirect to="/login" />
						}
					/>
					<Route
						exact
						path="/pet"
						render={({ history, location }) =>
							user ? (
								<Pet
									history={history}
									user={user}
									location={location}
									pets={this.state.pets}
								/>
							) : (
								<Redirect to="/login" />
							)
						}
					/>
					<Route
						exact
						path="/edit-pet"
						render={({ history, location }) =>
							user ? (
								<EditPet
									history={history}
									location={location}
									handleUpdatePet={this.handleUpdatePet}
								/>
							) : (
								<Redirect to="/login" />
							)
						}
					/>
					<Route
						path="/pets/add"
						render={() => (
							<AddPet
								user={this.state.user}
								handleAddPet={this.handleAddPet}
							/>
						)}
					/>
					<Route
						exact
						path="/user"
						render={({ location }) => (
							<OwnerProfile
								user={this.state.user}
								pets={this.state.pets}
								followedPets={this.state.followedPets}
								location={location}
							/>
						)}
					/>
					<Route
						exact
						path="/edit-user"
						render={({ location }) => (
							<EditUser
								location={location}
								handleUpdateUser={this.handleUpdateUser}
							/>
						)}
					/>
				</div>
			</>
		);
	}
}

export default App;
