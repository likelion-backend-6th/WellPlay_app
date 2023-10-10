import React, { useState, useEffect } from "react";
import { Col, Image, Row } from "react-bootstrap";
import Layout from "../components/Layout";
import CreateFeed from "../components/feeds/CreateFeed";
import Feed from "../components/feeds/Feed";
import ProfileCard from '../components/profile/ProfileCard';

function Home() {
  const [feeds, setFeeds] = useState([]);

  const fetchFeeds =  async function() {
	try {
	  // API 엔드포인트 URL 설정
	  const apiUrl = "http://127.0.0.1:8000/feed/"; // 실제 경로에 맞게 수정해야 합니다.

	  const response = await fetch(apiUrl, {
		method: "GET",
		headers: {
		  // 필요하면 헤더 설정 (e.g., 인증 토큰)
		},
	  });

	  if (!response.ok) {
		throw new Error("API 요청이 실패했습니다.");
	  }

	  const data = await response.json();
	  setFeeds(data);
	} catch (error) {
	  console.error("API 요청 오류:", error);
	}
  }

  useEffect(() => {
    fetchFeeds(); // 데이터 불러오기 함수 호출
  }, []);

  return (
    <Layout>
      <Row className="justify-content-evenly">
        <Col sm={7}>
          <Row className="border rounded align-items-center">
            {(
              <Col className="flex-shrink-1">
              </Col>
            )}
            <Col sm={10} className="flex-grow-1">
              <CreateFeed />
            </Col>
          </Row>
          <Row className="my-4">
            {feeds.map((feed, index) => (
              <Feed key={index} feed={feed} refresh={fetchFeeds} />
            ))}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;