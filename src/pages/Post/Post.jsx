import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as postAPI from '../../services/postService';
import * as userAPI from '../../services/userService';
import PostCard from '../../components/PostCard/PostCard';

class Post extends Component {
	state = {
		post: this.props.history.location.state.post,
		commenter: this.props.user._id,
		content: '',
	};

	// async componentDidMount() {
	// 	const user = await userAPI.getOne(this.props.user._id)
	// 	this.setState({commenter: user})
	// }

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		postAPI.handleAddComment(
			this.state.post._id,
			this.state.commenter,
			this.state.content
		);
		window.location.reload();
	};

	formRef = React.createRef();
	render() {
		const thisPost = this.state.post;
		return (
			<div>
				<div style={{ maxWidth: '500px' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
						<h1>{this.state.post.title}</h1>
					{this.state.commenter &&
						this.state.commenter === this.state.post.user && (
							<>&nbsp;&nbsp;&nbsp;&nbsp;
								<Link
									to={{
										pathname: '/edit-post',
										state: { thisPost },
									}}
								>
										<i class="far fa-edit"></i>
								</Link>
							</>
						)}
				</div>
					<p>{new Date(this.state.post.date).toLocaleDateString()}</p>
					<p>{this.state.post.content}</p>
					<h4>Tags</h4>
					<ul>
						{this.state.post.tags[0].split(',').map((tag) => (
							<li>{tag}</li>
						))}
					</ul>
				</div>
				<div
					style={{
						maxWidth: '500px',
						borderBottom: 'solid 1px black',
					}}
				>
					<h3>Comments</h3>
					<Form
						ref={this.formRef}
						onSubmit={this.handleSubmit}
						style={{ paddingLeft: '0', width: '100%' }}
					>
						<FormGroup>
							<Input
								onChange={this.handleChange}
								type="textarea"
								name="content"
								id="content"
								placeholder="Add your comment here"
								required
							/>
						</FormGroup>
						<Button type="submit">Add Comment</Button>
					</Form>
				</div>
				{this.state.post.comments.length ? (
					this.state.post.comments.map((el) => (
						<div>
							<h4>{el.commenter?.name}</h4>
							<p>{el.content}</p>
						</div>
					))
				) : (
					<p style={{ margin: '1em 1em 1em 0' }}>No comments yet.</p>
				)}
			</div>
		);
	}
}

//

export default Post;
