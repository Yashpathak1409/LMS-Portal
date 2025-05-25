import React, { useRef, useState } from "react";

const RecordOrUploadClass = () => {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [uploading, setUploading] = useState(false);

    const videoRef = useRef();

    // START RECORDING
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;

        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        setChunks([]);

        recorder.ondataavailable = (e) => setChunks((prev) => [...prev, e.data]);

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            uploadVideo(blob, "class-recording.webm");
            stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setRecording(true);
    };

    // STOP RECORDING
    const stopRecording = () => {
        mediaRecorder.stop();
        setRecording(false);
    };

    // HANDLE FILE UPLOAD FROM GALLERY
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadVideo(file, file.name);
        }
    };

    // COMMON UPLOAD FUNCTION
    const uploadVideo = (fileBlob, filename) => {
        const formData = new FormData();
        formData.append("video", fileBlob, filename);

        setUploading(true);
        fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                alert("✅ Video uploaded successfully!");
                console.log("Uploaded:", data);
            })
            .catch((err) => {
                alert("❌ Upload failed");
                console.error(err);
            })
            .finally(() => setUploading(false));
    };

    return (
        <div className="record-upload-container">
            <h2 className="text-xl font-bold mb-2">📚 Record or Upload Class</h2>

            <div className="video-section mb-4">
                <video ref={videoRef} autoPlay muted className="border rounded" width="400" />
            </div>

            <div className="button-group">
                {!recording ? (
                    <button onClick={startRecording} className="btn btn-green mr-2">🎥 Start Recording</button>
                ) : (
                    <button onClick={stopRecording} className="btn btn-red mr-2">⏹ Stop & Upload</button>
                )}

                <label className="btn btn-blue cursor-pointer">
                    📁 Upload from Gallery
                    <input type="file" accept="video/*" onChange={handleFileUpload} hidden />
                </label>
            </div>

            {uploading && <p className="text-yellow-500 mt-2">Uploading video... ⏳</p>}
        </div>
    );
};

export default RecordOrUploadClass;
