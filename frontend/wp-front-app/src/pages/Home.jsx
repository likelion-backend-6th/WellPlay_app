import React, {useState, useEffect} from "react";
import {Col, Image, Row} from "react-bootstrap";
import Layout from "../components/Layout";
import CreateFeed from "../components/feeds/CreateFeed";
import Feed from "../components/feeds/Feed";
import {useInView} from 'react-intersection-observer';
import "../App.css"
import "../components/default.css"

function Home() {
    const [feeds, setFeeds] = useState([]);
    const [tempFeeds, setTempFeeds] = useState([]);
    const [sortBy, setSortBy] = useState('latest');
    const [selectedButton, setSelectedButton] = useState(null);

    const [ref, inView] = useInView();
    const [page, setPage] = useState(0)

    const [hasMoreFeeds, setHasMoreFeeds] = useState(true);
    const [initialLoad, setInitialLoad] = useState(false);

    const handleSortByLatest = () => {
        setSelectedButton('latest');
        setSortBy('latest');
        setPage(1);
        setInitialLoad(true);
    }

    const handleSortByRecommend = () => {
        setSelectedButton('recommend');
        setSortBy('recommend');
        setPage(1);
        setInitialLoad(true);
    }

    const fetchFeeds = async function () {
        for (let i = 1; i <= page; i++) {
            let apiUrl;

            if (sortBy === 'latest') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/";
            } else if (sortBy === 'recommend') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/recommend";
            }

            const response = await fetch(apiUrl + `?page=${i}`, {
                method: "GET",
                headers: {
                    // 필요하면 헤더 설정 (e.g., 인증 토큰)
                },
            });
            if (!response.ok) {
                throw new Error("API 요청이 실패했습니다.");
            }
            const data = await response.json();
            tempFeeds.push(...data.results)
        }
        setFeeds(tempFeeds);
        setTempFeeds([])
    }

    const fetchFeedsbyScroll = async function () {
        try {
            let apiUrl;

            if (sortBy === 'latest') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/";
            } else if (sortBy === 'recommend') {
                apiUrl = process.env.REACT_APP_API_URL + "/feed/recommend";
            }

            const response = await fetch(apiUrl + `?page=${page+1}`, {
                method: "GET",
                headers: {
                    // 필요하면 헤더 설정 (e.g., 인증 토큰)
                },
            });

            const data = await response.json();
            if (data.next != null) {

            } else {
                setHasMoreFeeds(false);
            }

            if (!response.ok) {
                throw new Error("API 요청이 실패했습니다.");
            }

            setFeeds(feeds => [...feeds, ...data.results]);
        } catch (error) {
            console.error("API 요청 오류:", error);
        }
    }

    useEffect(() => {
        if (inView && hasMoreFeeds) {
            setPage((page) => page + 1)
            fetchFeedsbyScroll();
        }
    }, [inView, hasMoreFeeds]);

    useEffect(() => {
        if (initialLoad) {
            fetchFeeds();
        }
    }, [sortBy, initialLoad]);

    return (
        <Layout>
            <Row className="justify-content-evenly main">
                <Col sm={7}>
                    <Col sm={12}> {/* 전체 가로 공간을 사용할 열 */}
                        <div className="button-container">
                        <button
                            className={`button-bottom ${
                            selectedButton === 'latest' ? 'selected' : ''
                            }`}
                            onClick={handleSortByLatest}
                        >
                            최신
                        </button>
                        <button
                            className={`button-bottom ${
                            selectedButton === 'recommend' ? 'selected' : ''
                            }`}
                            onClick={handleSortByRecommend}
                        >
                            추천순
                        </button>
                        </div>
                    </Col>
                    <Row className="my-4" style={{ width: '30em'}}>
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