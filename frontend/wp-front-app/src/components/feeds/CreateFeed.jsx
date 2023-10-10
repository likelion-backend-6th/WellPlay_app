import React, { useContext, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import axiosService from "../../helpers/axios"
import { getUser } from "../../hooks/user.actions"
import { Context } from "../Layout"

function CreateFeed() {
	const [show, setShow] = useState(false)
	const [validated, setValidated] = useState(false)
	const [form, setForm] = useState({})
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)
	const [selectedFile, setSelectedFile] = useState(null);

	const { setToaster } = useContext(Context)

	const user = getUser()

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		const createFeedForm = event.currentTarget
		if (createFeedForm.checkValidity() === false) {
			event.stopPropagation()
		}
		setValidated(true)

		const data = {
			content: form.body,
			image: form.image,
			video: form.video,
		}

		if (selectedFile) {
			const formData = new FormData();
			formData.append("image", selectedFile);
		}

		axiosService
			.post("/feed/", data)
			.then(() => {
				handleClose()
				setForm({})
				setToaster({
					type: "success",
					message: "Post created 🚀",
					show: true,
					title: "Post Success",
				})
			})
			.catch((error) => {
				setToaster({
					type: "danger",
					message: "An error occurred.",
					show: true,
					title: "Post Error",
				})
				console.log(error)
			})
	}
	console.log(form)
	return (
		<>
			<Form.Group>
				<Form.Control
					className="py-2 rounded-pill border-primary text-primary"
					type="text"
					placeholder="Write a feed"
					onClick={handleShow}
				/>
			</Form.Group>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton className="border-0">
					<Modal.Title>Create Feed</Modal.Title>
				</Modal.Header>
				<Modal.Body className="border-0">
					<Form noValidate validated={validated} onSubmit={handleSubmit}>
						<Form.Group className="mb-3">
							<Form.Label>Content</Form.Label>
							<Form.Control
								name="body"
								value={form.body}
								onChange={(e) => setForm({ ...form, body: e.target.value })}
								as="textarea"
								rows={3}
							/>
							<Form.Label className="mt-3">Upload image</Form.Label>
							<Form.Control
								type="file"
								placeholder="image"
								name="image"
								value={form.image}
								onChange={(e) => setForm({handleFileChange})}
							/>
							<Form.Label className="mt-3">Upload video</Form.Label>
							<Form.Control
								type="file"
								placeholder="Video"
								name="video"
								value={form.video}
								onChange={(e) => setForm({handleFileChange})}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="primary"
						onClick={handleSubmit}
						disabled={form.body === undefined}
					>
						게시
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default CreateFeed
