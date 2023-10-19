import React, {useState, useContext, useEffect} from "react";
import {Modal, Button, Row, Col} from "react-bootstrap";
import CommentList from "./CommentList"; // CommentList 컴포넌트 불러오기
import CommentForm from "./CommentForm"; // CommentForm 컴포넌트 불러오기
import Feed from "../feeds/Feed"; // Feed 컴포넌트 불러오기
import axiosService from "../../helpers/axios";
import {getUser} from "../../hooks/user.actions";
import {Context} from "../Layout";
import "../default.css";
import axios from "axios";

function CommentModal({feedId, show, handleClose, refreshComments, props,}) {
    const {refresh} = props
    const user = getUser();
    const {setToaster} = useContext(Context);
    const [feedData, setFeedData] = useState(null); // Feed 데이터를 저장하는 상태

    const fetchFeedId = (feedId) => {
        axios
            .get(process.env.REACT_APP_API_URL + `/feed/${feedId}/`)
            .then((response) => {
                setFeedData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (show) {
            fetchFeedId(feedId)
        }
    }, [feedId, show]);

    useEffect(() => {
        if (!show) {
            setFeedData(null);
        }
    }, [show]);

    const handleLikeClickinModal = (action, data) => {
        axiosService
            .post(`/feed/${feedId}/${action}/`, data)
            .then(() => {
                refresh();
                fetchFeedId(feedId);
            })
            .catch((err) => console.error(err));
    };

    const feedProps = { feed: feedData, isSingleFeed: true, refresh, handleLikeClickinModal };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered className="custom-modal">
            <Modal.Body className="border-0" style={{maxHeight: "calc(100vh - 200px)", overflowY: "auto"}}>
                <Row>
                    <Col sm={8}>
                        {feedData && <Feed {...feedProps} />}
                    </Col>
                    <Col sm={4} style={{maxHeight: "calc(100vh - 200px)", overflowY: "auto"}}>
                        <CommentList feedId={feedId} onCommentPosted={refreshComments} props={props}/>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

export default CommentModal;