import React from "react"
import { Card, Image } from "react-bootstrap"
import { format } from "timeago.js"

import { CommentOutlined, LikeFilled, LikeOutlined } from "@ant-design/icons"
import axiosService from "../../helpers/axios"
import { Link } from "react-router-dom"

function Feed(props) {
	const { feed, refresh, isSingleFeed } = props

	const handleLikeClick = (action) => {
		axiosService
			.post(`/feed/${feed.id}/${action}/`)
			.then(() => {
				refresh()
			})
			.catch((err) => console.error(err))
	}

	return (
		<>
			<Card className="rounded-3 my-4">
				<Card.Body>
					<Card.Title className="d-flex flex-row justify-content-between">
						<div className="d-flex flex-row">
							<Image
								src={feed.owner.image_url}
								roundedCircle
								width={48}
								height={48}
								className="me-2 border border-primary
                          border-2"
							/>
							<div className="d-flex flex-column justify-content-start align-self-center mt-2">
								<p className="fs-6 m-0">{feed.owner.username}</p>
								<p className="fs-6 fw-lighter">
									<small>{format(feed.created_at)}</small>
								</p>
								{/* {!isSingleFeed && (
									<p className="ms-1 fs-6">
										<small>
											<Link>{feed.comments_count} comments</Link>
										</small>
									</p>
								)} */}
							</div>
						</div>
					</Card.Title>
					<Card.Text>{feed.content}</Card.Text>
					<div className="d-flex flex-row">
						<LikeFilled
							style={{
								color: "#fff",
								backgroundColor: "#0D6EFD",
								borderRadius: "50%",
								width: "18px",
								height: "18px",
								fontSize: "75%",
								padding: "2px",
								margin: "3px",
							}}
						/>
						<p className="ms-1 fs-6">
							<small>{feed.like} like</small>
						</p>
					</div>
				</Card.Body>
				<Card.Footer className="d-flex bg-white w-50 justify-content-between border-0">
					<div className="d-flex flex-row">
						<LikeOutlined
							style={{
								width: "24px",
								height: "24px",
								padding: "2px",
								fontSize: "20px",
								color: feed.liked ? "#0D6EFD" : "#C4C4C4",
							}}
							onClick={() => {
								if (feed.liked) {
									handleLikeClick("remove_like")
								} else {
									handleLikeClick("like")
								}
							}}
						/>
						<p className="ms-1">
							<small>Like</small>
						</p>
					</div>
					{!isSingleFeed && (
						<div className="d-flex flex-row">
							<CommentOutlined
								style={{
									width: "24px",
									height: "24px",
									padding: "2px",
									fontSize: "20px",
									color: "#C4C4C4",
								}}
							/>
							<p className="ms-1 mb-0">
								<small>{feed.comment} Comment</small>
							</p>
						</div>
					)}
				</Card.Footer>
			</Card>
		</>
	)
}

export default Feed