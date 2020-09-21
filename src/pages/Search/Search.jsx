import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

class Search extends Component {
	state = {
		distance: [1, 2, 3, 4, 5],
		animalType: ['Dog', 'Cat', 'Snake', 'Rabbit'],
		searchResponse: null,
		formData: {
			type: 'Dog',
			distance: '1',
			condition: '',
		},
		results: [],
	};

	handleChange = (e) => {
		const formData = {
			...this.state.formData,
			[e.target.name]: e.target.value,
		};
		this.setState({
			formData,
		});

		console.log(this.state.formData);
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.handleSearch(this.state.formData);
	};

	getData = () => {
		axios
			.get('/api/pets/search', {
				params: {
					type: this.state.formData.type,
					distance: this.state.formData.distance,
					condition: this.state.formData.condition,
				},
			})
			.then(function (response) {
				console.log(response.data);
				this.setState({ results: response.data });
			});
	};

	// handleSubmit = async (e) => {
	// should submit the form to a service function that will call the backend and retrieve the filtered data and set the searchResponse state.
	// };

	formRef = React.createRef();
	render() {
		return (
			<>
				<h1>Search Page</h1>
				<Form ref={this.formRef} onSubmit={this.getData}>
					<FormGroup>
						<Label for="type">Animal Type:</Label>
						<Input
							onChange={this.handleChange}
							type="select"
							name="type"
							value={this.state.formData.type}
						>
							{this.state.animalType.map((animal) => (
								<option>{animal}</option>
							))}
						</Input>
					</FormGroup>
					{/*  */}
					<FormGroup>
						<Label for="distance">Miles From You:</Label>
						<Input
							onChange={this.handleChange}
							type="select"
							name="distance"
							value={this.state.formData.distance}
						>
							{this.state.distance.map((distance) => (
								<option>{distance}</option>
							))}
						</Input>
					</FormGroup>
					{/*  */}
					<FormGroup>
						<Label for="condition">Condition:</Label>
						<Input
							onChange={this.handleChange}
							type="text"
							name="condition"
							value={this.state.formData.condition}
						/>
					</FormGroup>
					<Button>Search Pets</Button>
				</Form>

				{/* map response from state, if there is no data, tell the user there is no data. */}
			</>
		);
	}
}

export default Search;
