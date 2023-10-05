import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
import ProtectedRoute from './routes/ProtectedRoute';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
            path="/post/:postId/"
            element={
              <ProtectedRoute>
                <SinglePost/>
              </ProtectedRoute>
            }
        />
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
                <EditProfile />
              </ProtectedRoute>
            }
        />
        <Route path="/register/" element={<Registration/>}/>
      </Routes>
  );
}

export default App;
