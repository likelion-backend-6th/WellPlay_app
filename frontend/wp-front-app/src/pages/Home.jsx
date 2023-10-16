import React, {useState, useEffect} from "react";
import {Col, Image, Row} from "react-bootstrap";
import Layout from "../components/Layout";
import CreateFeed from "../components/feeds/CreateFeed";
import Feed from "../components/feeds/Feed";
import {useInView} from 'react-intersection-observer';

function Home() {
    const [feeds, setFeeds] = useState([]);
    const [sortBy, setSortBy] = useState('latest');

    const [ref, inView] = useInView();
    const [page, setPage] = useState(1)

    const [hasMoreFeeds, setHasMoreFeeds] = useState(true);

    const handleSortByLatest = () => {
        setSortBy('latest');
        setPage(1);
    }

    const handleSortByRecommend = () => {
        setSortBy('recommend');
        setPage(1);
    }

    const fetchFeeds = async function () {
        try {
            let apiUrl;

            if (sortBy === 'latest') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/";
            } else if (sortBy === 'recommend') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/recommend";
            }

            const response = await fetch(apiUrl + `?page=${page}`, {
                method: "GET",
                headers: {
                    // 필요하면 헤더 설정 (e.g., 인증 토큰)
                },
            });

            if (!response.ok) {
                throw new Error("API 요청이 실패했습니다.");
            }

            const data = await response.json();
            setFeeds(data.results);
        } catch (error) {
            console.error("API 요청 오류:", error);
        }
    }

    const fetchFeedsbyScroll = async function () {
        try {
            let apiUrl;
            console.log(page + '페이지 로드함')

            if (sortBy === 'latest') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/";
            } else if (sortBy === 'recommend') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/recommend";
            }

            const response = await fetch(apiUrl + `?page=${page}`, {
                method: "GET",
                headers: {
                    // 필요하면 헤더 설정 (e.g., 인증 토큰)
                },
            });

            if (!response.ok) {
                throw new Error("API 요청이 실패했습니다.");
            }

            const data = await response.json();
            setFeeds(feeds => [...feeds, ...data.results]);


            if (data.next != null) {
                setPage((page) => page + 1)
            } else {
                console.log("페이지 새로고침 멈춤 테스트");
                setHasMoreFeeds(false);
            }

        } catch (error) {
            console.error("API 요청 오류:", error);
        }
    }

    useEffect(() => {
        fetchFeeds();
        setPage(1)
    }, [sortBy]);

    useEffect(() => {
        if (inView && hasMoreFeeds) {
            fetchFeedsbyScroll();
        }
    }, [inView, hasMoreFeeds]);

    return (
        <Layout>
            <Row className="justify-content-evenly">
                <Col sm={7}>
                    <Col sm={12}> {/* 전체 가로 공간을 사용할 열 */}
                        <button onClick={handleSortByLatest}>최신</button>
                        <button onClick={handleSortByRecommend}>추천순</button>
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
                        {feeds.map((feed, index) => (
                            <Feed key={index} feed={feed} refresh={fetchFeeds}/>
                        ))}
                    </Row>
                </Col>
                <div ref={ref}></div>
            </Row>
        </Layout>
    );
}

export default Home;