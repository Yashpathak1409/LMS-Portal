import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";

const MyClasses = () => {
    const location = useLocation();
    const { videos } = location.state || {}; // Retrieving videos passed from AdminDashboard
    const [fullscreenVideo, setFullscreenVideo] = useState(null); // Track fullscreen video

    const openFullscreen = (index) => {
        setFullscreenVideo(index); // Set the clicked video index for fullscreen
    };

    const closeFullscreen = () => {
        setFullscreenVideo(null); // Close fullscreen
    };

    return (
        <div className="my-classes">
            <h1 className="text-3xl font-bold">Course Videos</h1>
            {videos ? (
                <div className="video-grid">
                    {videos.map((video, index) => (
                        <div key={index} className="video-card">
                            <div className="video-player-container">
                                <ReactPlayer
                                    url={video.link}
                                    controls
                                    width="100%"
                                    height="250px"
                                />
                                <h3>{video.title}</h3>
                                <p>{video.description}</p>
                                {/* Fullscreen Button */}
                                <button
                                    className="fullscreen-btn"
                                    onClick={() => openFullscreen(index)} // Open fullscreen on click
                                    title="Enter Fullscreen"
                                >
                                    ⛶
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No videos available for this course.</p>
            )}

            {/* Fullscreen Modal */}
            {fullscreenVideo !== null && (
                <div className="fullscreen-modal">
                    <div className="fullscreen-content">
                        <ReactPlayer
                            url={videos[fullscreenVideo].link}
                            controls
                            width="100%"
                            height="100%"
                        />
                        <button
                            className="close-btn"
                            onClick={closeFullscreen}
                            title="Close Fullscreen"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClasses;
