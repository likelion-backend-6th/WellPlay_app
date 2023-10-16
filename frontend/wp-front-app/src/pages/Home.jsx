import React, {useState, useEffect} from "react";
import {Col, Image, Row} from "react-bootstrap";
import Layout from "../components/Layout";
import CreateFeed from "../components/feeds/CreateFeed";
import Feed from "../components/feeds/Feed";
import ProfileCard from '../components/profile/ProfileCard';

function Home() {
    const [feeds, setFeeds] = useState([]);
    const [sortBy, setSortBy] = useState('latest');

    const fetchFeeds = async function () {
        try {
            let apiUrl;

            if (sortBy === 'latest') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/";
            } else if (sortBy === 'recommend') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/recommend";
            }

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
    }, [sortBy]);

    return (
        <Layout>
            <Row className="justify-content-evenly">
                <Col sm={7}>
                    <Col sm={12}> {/* 전체 가로 공간을 사용할 열 */}
                        <button onClick={() => setSortBy('latest')}>최신</button>
                        <button onClick={() => setSortBy('recommend')}>추천순</button>
                    </Col>
                    <Row className="border rounded align-items-center">
                        {(
                            <Col className="flex-shrink-1">
                            </Col>
                        )}
                        <Col sm={10} className="flex-grow-1">
                            <CreateFeed refresh={fetchFeeds}/>
                        </Col>
                    </Row>
                    <Row className="my-4">
                        {feeds.results && feeds.results.map((feed, index) => (
                            <Feed key={index} feed={feed} refresh={fetchFeeds}/>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
}

export default Home;