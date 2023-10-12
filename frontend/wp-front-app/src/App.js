import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import FollowerList from "./components/follow/Follower";
import FollowingList from "./components/follow/Following";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route
                path="/profile/:profileId/"
                element={
                    <ProtectedRoute>
                        <Profile/>
                    </ProtectedRoute>
                }/>
            <Route
                path="/profile/:profileId/edit/"
                element={
                    <ProtectedRoute>
                        <EditProfile/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/follower"
                element={
                    <ProtectedRoute>
                        <FollowerList/>
                    </ProtectedRoute>
                }/>
            <Route
                path="/following"
                element={
                    <ProtectedRoute>
                        <FollowingList/>
                    </ProtectedRoute>
                }/>
        </Routes>
    );
}

export default App;
