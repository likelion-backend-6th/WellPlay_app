import React, {useEffect, useState} from "react"
import { Card, Image } from "react-bootstrap"
import { format } from "timeago.js"
import { CommentOutlined, LikeFilled, LikeOutlined } from "@ant-design/icons"
import axiosService from "../../helpers/axios"
import { Link } from "react-router-dom"
import {getUser, useUserActions} from "../../hooks/user.actions"

function Feed(props) {
	const { feed, refresh, isSingleFeed } = props
	const user = getUser();
	const {getUserProfile} = useUserActions();
    const [profile, setProfile] = useState({});
    const userid = feed.user_id

	const fetchProfile = (userid) => {
        getUserProfile(userid)
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error('프로필 정보를 가져오는 중 오류 발생:', error);
            });
    };
	useEffect(() => {
        fetchProfile(userid);
    }, []);

	const handleLikeClick = (action, data) => {
		axiosService
			.post(`/feed/${feed.id}/${action}/`, data)
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
								src={feed.profile_image}
								roundedCircle
								width={48}
								height={48}
								className="me-2 border border-dark
                          border-2"
							/>
							<div className="d-flex flex-column justify-content-start align-self-center mt-2">
								<p className="fs-6 m-0">{profile.nickname}</p>
								<p className="fs-6 fw-lighter">
									<small>{format(feed.created_at)}</small>
								</p>
							</div>
						</div>
					</Card.Title>
					<Card.Text>
						{feed.content}
						{feed.image_url && (
							<Image
								src={feed.image_url}
								width={48}
								height={48}
								className="me-2 mb-3 border border-dark border-2"
							/>
						)}
						{feed.video_url && (
							<video
								src={feed.video_url}
								controls={true}
								className="border border-dark border-2"
								width="100%"
								height="100%"
								autoPlay={true}
								loop={false}
								muted={false}
							/>
						)}
					</Card.Text>
				</Card.Body>
				<Card.Footer className="d-flex bg-white w-50 justify-content-between border-0">
					<div className="d-flex flex-row">
						<LikeOutlined
							style={{
								width: "24px",
								height: "24px",
								padding: "2px",
								fontSize: "20px",
								color: feed.like ? "#0D6EFD" : "#C4C4C4",
							}}
							onClick={() => {
								handleLikeClick("like", {"user": user.id, "feed": feed.id})
							}}
						/>
						<p className="ms-1">
							<small>{feed.like} Like</small>
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