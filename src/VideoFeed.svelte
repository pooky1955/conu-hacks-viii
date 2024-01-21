<script>
	import { Peer } from "peerjs"
	import { socketStore, roomStore, userStore } from "./store.js"
	import { FaceDetector, FilesetResolver, Detection } from "@mediapipe/tasks-vision"

	const peer = new Peer($socketStore.userId, {
		//TODO: change to production server
		host: "localhost",
		port: 9000,
		path: "/rtc",
	})

	navigator.mediaDevices
		.getUserMedia({ video: true, audio: false })
		.then((myStream) => {
			// console.log("myStream", myStream)
			document.getElementById("remoteVideo").srcObject = myStream
			document.getElementById("remoteVideo").addEventListener("loadeddata", predictWebcam)

			$socketStore.on("callPlayer", (args) => {
				// console.log("callPlayer", args)
				setTimeout(() => {
					const call = peer.call(args.id, myStream)
					call.on("stream", (remoteStream) => {
						// console.log("remoteStream", remoteStream)
						// Show stream in some <video> element.
						document.getElementById("remoteVideo").srcObject = remoteStream
						document.getElementById("remoteVideo").addEventListener("loadeddata", predictWebcam)
					})
				}, 2000)
			})

			peer.on("call", (call) => {
				// console.log("receivingCall", call)
				call.answer(myStream) // Answer the call with an A/V stream.
				call.on("stream", (remoteStream) => {
					// console.log("remoteStream", remoteStream)
					// Show stream in some <video> element.
					document.getElementById("remoteVideo").srcObject = remoteStream
					document.getElementById("remoteVideo").addEventListener("loadeddata", predictWebcam)
				})
			})
		})
		.catch((err) => {
			console.error("Failed to get local stream", err)
		})

	// $socketStore.on("callPlayer", (args) => {
	//     // console.log("callPlayer1", args);
	//     // setTimeout(() => {
	//     //     peer.connect(args.id);
	//     // }, 5000);
	//     // console.log("callPlayer2", args);
	//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
	//         (stream) => {
	//             // console.log("myStream", stream);
	//             document.getElementById("localVideo").srcObject = stream;
	//             setTimeout(() => {
	//                 // console.log("callPlayer3", args);
	//                 const call = peer.call(args.id, stream);
	//                 call.on("stream", (remoteStream) => {
	//                     // console.log("remoteStream", remoteStream);
	//                     // Show stream in some <video> element.
	//                     document.getElementById("remoteVideo").srcObject = remoteStream;
	//                 });
	//             }, 5000);
	//         }).catch((err) => {
	//             console.error("Failed to get local stream", err);
	//         });

	// });

	// // console.log("peer", peer);

	// peer.on("call", (call) => {
	//     // console.log("receivingCall", call);
	//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
	//         (stream) => {
	//             // console.log("myStream", stream);
	//             document.getElementById("localVideo").srcObject = stream;
	//             setTimeout(() => {
	//                 call.answer(stream); // Answer the call with an A/V stream.
	//                 call.on("stream", (remoteStream) => {
	//                     // console.log("remoteStream", remoteStream);
	//                     // Show stream in some <video> element.
	//                     document.getElementById("remoteVideo").srcObject = remoteStream;
	//                 });
	//             }, 2000)
	//         }).catch(
	//         (err) => {
	//             console.error("Failed to get local stream", err);
	//         })
	// });

	let faceDetector

	// Initialize the object detector
	const initializefaceDetector = async () => {
		const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm")
		faceDetector = await FaceDetector.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
				delegate: "GPU",
			},
			runningMode: "VIDEO",
		})
	}
	initializefaceDetector()

	let lastVideoTime = -1
	async function predictWebcam() {
		let startTimeMs = performance.now()
		let video = document.getElementById("remoteVideo")
		// Detect faces using detectForVideo
		if (video.currentTime !== lastVideoTime) {
			lastVideoTime = video.currentTime
			const detections = faceDetector.detectForVideo(video, startTimeMs).detections
			// // console.log(detections)

			if (detections.length > 0) {
				computeFaceBox(detections[0])
			}
			// displayVideoDetections(detections)
		}

		// Call this function again to keep predicting when the browser is ready
		window.requestAnimationFrame(predictWebcam)
	}

	const computeFaceBox = (detection) => {
		const video = document.getElementById("remoteVideo")
		const { width, height, originX, originY } = detection.boundingBox
		const relativeLeft = ((video.videoWidth - originX - width) * 100) / video.videoWidth
		const relativeLeft2 = ((video.videoWidth - originX - width / 2) * 100) / video.videoWidth
		const relativeTop = (originY * 100) / video.videoHeight
		const relativeWidth = (width * 100) / video.videoWidth
		// // console.log(video, width, video.videoWidth, relativeLeft, relativeTop, relativeWidth)
		// // console.log("video ")
		document.getElementById("square").style = "left: " + relativeLeft + "%;" + "top: " + relativeTop + "%;" + "width: " + relativeWidth + "%;"
		// const scale = 1/((relativeWidth+20)/100)
		const scale = video.videoWidth / (width + 200)
		document.getElementById("remoteVideoFilter").style =
			"transform:  scale(" + scale + ") translate(" + (50 - relativeLeft2) + "%, " + (50 - relativeTop - 5) + "%);"
	}

	// function displayVideoDetections(detections) {
	// 	// Remove any highlighting from previous frame.
	// 	var children = []
	// 	const liveView = document.getElementById("liveView")
	// 	let video = document.getElementById("remoteVideo")
	// 	for (let child of children) {
	// 		liveView.removeChild(child)
	// 	}
	// 	children.splice(0)
	// 	// Iterate through predictions and draw them to the live view
	// 	for (let detection of detections) {

	// 		const highlighter = document.createElement("div")
	// 		highlighter.setAttribute("class", "highlighter")
	// 		highlighter.style =
	// 			"left: " +
	// 			(video.offsetWidth - detection.boundingBox.width - detection.boundingBox.originX) +
	// 			"px;" +
	// 			"top: " +
	// 			detection.boundingBox.originY +
	// 			"px;" +
	// 			"width: " +
	// 			(detection.boundingBox.width - 10) +
	// 			"px;" +
	// 			"height: " +
	// 			detection.boundingBox.height +
	// 			"px;"

	// 		liveView.appendChild(highlighter)
	// 		// liveView.appendChild(p)

	// 		// Store drawn objects in memory so they are queued to delete at next call
	// 		children.push(highlighter)
	// 		// children.push(p)
	// 		// for (let keypoint of detection.keypoints) {
	// 		// 	const keypointEl = document.createElement("spam")
	// 		// 	keypointEl.className = "key-point"
	// 		// 	keypointEl.style.top = `${keypoint.y * video.offsetHeight - 3}px`
	// 		// 	keypointEl.style.left = `${video.offsetWidth - keypoint.x * video.offsetWidth - 3}px`
	// 		// 	liveView.appendChild(keypointEl)
	// 		// 	children.push(keypointEl)
	// 		// }
	// 	}
	// }
</script>

<div id="liveView">
	<video id="localVideo" autoplay muted></video>
	<div id="remoteVideoCanvas">
		<span id="square"></span>
		<div id="remoteVideoFilter">
			<video id="remoteVideo" autoplay> </video>
		</div>
	</div>
</div>

<style>
	#localVideo {
		display: none;
	}

	#remoteVideoCanvas {
		position: relative;
		width: 20rem;
		overflow: hidden;
        -webkit-mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 40%, transparent 50%);
		mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 40%, transparent 50%);
	}

	#remoteVideoFilter {
		transition-property: transform;
		transition-duration: 0.1s;
		transition-timing-function: ease-in-out;
	}

	#square {
		position: absolute;
		z-index: 1;
		left: 0;
		bottom: 0;
		width: 0;
		aspect-ratio: 1;
		border: 1px solid red;
	}

	#remoteVideo {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		clear: both;
		display: block;
		transform: rotateY(180deg);
		-webkit-transform: rotateY(180deg);
		-moz-transform: rotateY(180deg);
	}
</style>
