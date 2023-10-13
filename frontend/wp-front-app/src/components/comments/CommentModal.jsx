import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import CommentList from "./CommentList"; // CommentList 컴포넌트 불러오기
import CommentForm from "./CommentForm"; // CommentForm 컴포넌트 불러오기
import Feed from "../feeds/Feed"; // Feed 컴포넌트 불러오기
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import { Context } from "../Layout";
import "../default.css";

function CommentModal({ feedId, show, handleClose, refreshComments, props,}) {
  const user = getUser();
  const { setToaster } = useContext(Context);
  const [feedData, setFeedData] = useState(null); // Feed 데이터를 저장하는 상태

  useEffect(() => {
    // API 요청을 사용하여 feedId에 해당하는 피드 데이터 가져오기
    axiosService
      .get(`/feed/${feedId}/`) // 예시 API 엔드포인트
      .then((response) => {
        setFeedData(response.data);
        console.log("CommentModal에서",feedId)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [feedId]);

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Body className="border-0" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        <Row>
          <Col sm={8}>
            <Feed feed={feedData} isSingleFeed={true} />
          </Col>
          <Col sm={4} style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <CommentList feedId={feedId} onCommentPosted={refreshComments} props={props} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default CommentModal;