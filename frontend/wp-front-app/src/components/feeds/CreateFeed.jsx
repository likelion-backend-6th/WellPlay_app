import React, { useContext, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import axiosService from "../../helpers/axios"
import { getUser } from "../../hooks/user.actions"
import { Context } from "../Layout"
import "../../App.css"

function CreateFeed() {
	const [show, setShow] = useState(false)
	const [validated, setValidated] = useState(false)
	const [form, setForm] = useState({})
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)
	const [selectedFile, setSelectedFile] = useState(null);

	const { setToaster } = useContext(Context)

	const user = getUser()

	const [formData, setFormData] = useState({
		image: null,
		video: null,
	  });
	
	  const handleInputChange = (e) => {
		const { name, files } = e.target;
		setFormData({
		  ...formData,
		  [name]: files[0], // 파일 객체를 저장
		});
	  };

	const data = new FormData();
	data.append('content', form.body);

	if (formData.image) {
		data.append('image', formData.image);
	}
	if (formData.video) {
		data.append('video', formData.video);
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		const createFeedForm = event.currentTarget
		if (createFeedForm.checkValidity() === false) {
			event.stopPropagation()
		}
		setValidated(true)


		axiosService
			.post("/feed/", data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
			.then(() => {
				handleClose()
				setForm({})
				setToaster({
					type: "success",
					message: "Post created 🚀",
					show: true,
					title: "Post Success",
				})
				window.location.reload();
			})
			.catch((error) => {
				setToaster({
					type: "danger",
					message: "An error occurred.",
					show: true,
					title: "Post Error",
				})
			})
	}
	
	return (
		<>
			<Button variant="secondary" onClick={handleShow} className="write-button" >
				<img src="/media/nav/plus.png" alt="글쓰기"/>글쓰기
			</Button>
			<Modal show={show} onHide={handleClose} className="custom-modal">
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
							style={{ whiteSpace: 'pre-line' }}
							/>
							<Form.Label className="mt-3">Upload image</Form.Label>
							<Form.Control
								type="file"
								placeholder="image"
								name="image"
								value={form.image}
								onChange={handleInputChange}
							/>
							<Form.Label className="mt-3">Upload video</Form.Label>
							<Form.Control
								type="file"
								placeholder="Video"
								name="video"
								value={form.video}
								onChange={handleInputChange}
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
