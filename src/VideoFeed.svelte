<script>
    import { Peer } from "peerjs";
    import { socketStore, roomStore, userStore } from './store.js'

    const peer = new Peer($socketStore.userId, {
        //TODO: change to production server
        host: "localhost",
        port: 9000,
        path: "/rtc",
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((myStream) => {
        console.log("myStream", myStream);
        document.getElementById("localVideo").srcObject = myStream;

        $socketStore.on("callPlayer", (args) => {
            console.log("callPlayer", args);
            setTimeout(() => {
                const call = peer.call(args.id, myStream);
                call.on("stream", (remoteStream) => {
                    console.log("remoteStream", remoteStream);
                    // Show stream in some <video> element.
                    document.getElementById("remoteVideo").srcObject = remoteStream;
                });
            }, 2000);
        });

        peer.on("call", (call) => {
            console.log("receivingCall", call);
            call.answer(myStream); // Answer the call with an A/V stream.
            call.on("stream", (remoteStream) => {
                console.log("remoteStream", remoteStream);
                // Show stream in some <video> element.
                document.getElementById("remoteVideo").srcObject = remoteStream;
            });
        })
    }).catch((err) => {
        console.error("Failed to get local stream", err);
    });


    // $socketStore.on("callPlayer", (args) => {
    //     console.log("callPlayer1", args);
    //     // setTimeout(() => {
    //     //     peer.connect(args.id);
    //     // }, 5000);
    //     console.log("callPlayer2", args);
    //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
    //         (stream) => {
    //             console.log("myStream", stream);
    //             document.getElementById("localVideo").srcObject = stream;
    //             setTimeout(() => {
    //                 console.log("callPlayer3", args);
    //                 const call = peer.call(args.id, stream);
    //                 call.on("stream", (remoteStream) => {
    //                     console.log("remoteStream", remoteStream);
    //                     // Show stream in some <video> element.
    //                     document.getElementById("remoteVideo").srcObject = remoteStream;
    //                 });
    //             }, 5000);
    //         }).catch((err) => {
    //             console.error("Failed to get local stream", err);
    //         });
    
    // });

    // console.log("peer", peer);

    // peer.on("call", (call) => {
    //     console.log("receivingCall", call);
    //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
    //         (stream) => {
    //             console.log("myStream", stream);
    //             document.getElementById("localVideo").srcObject = stream;
    //             setTimeout(() => {
    //                 call.answer(stream); // Answer the call with an A/V stream.
    //                 call.on("stream", (remoteStream) => {
    //                     console.log("remoteStream", remoteStream);
    //                     // Show stream in some <video> element.
    //                     document.getElementById("remoteVideo").srcObject = remoteStream;
    //                 });
    //             }, 2000)
    //         }).catch(
    //         (err) => {
    //             console.error("Failed to get local stream", err);
    //         })
    // });
</script>

<div>
    <video id="localVideo" autoplay muted></video>
    <video id="remoteVideo" autoplay></video>
</div>

<style>
    #remoteVideo {
        clear: both;
        display: block;
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
    }
</style>