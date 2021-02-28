import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import * as tmImage from '@teachablemachine/image';
import { useRouter } from 'next/router';

//const URL = 'https://storage.googleapis.com/tm-model/gh4SD1u8v/';
const URL = 'https://storage.googleapis.com/tm-model/gh4SD1u8v/';
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

const imageMarker = [
    "TV",
]



function TeachableMachineTracking() {

    const [isLoading, setIsLoading] = useState(true)
    const videoRef = useRef()
    let model, code;

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            console.log('ready')
            code = router.query.code
            _init()
        }
    }, [router.isReady])


    const _init = async () => {

        localStorage.setItem('filtercode', code)

        model = await tmImage.load(modelURL, metadataURL);
        let webcamStream = await navigator.mediaDevices.getUserMedia({
            video: {
                advanced: [
                    {
                        facingMode: "environment",
                    },
                ],
            },
            audio: false,
        });

        videoRef.current.srcObject = webcamStream;
        window.stream = webcamStream;

        const delay = (s) => {
            return new Promise((resolve) => {
                setTimeout(resolve, s);
            });
        };

        await delay(2500)
        window.requestId = window.requestAnimationFrame(_loop);

    }

    const _loop = async () => {
        try {
            await _predict();
        } catch (err) {
            console.log(err)
        }

    }

    const _predict = async () => {

        if (videoRef.current.srcObject !== null) {
            const prediction = await model.predict(videoRef.current);
            let probabilities = {
                TV: 0.95,
            };

            prediction.forEach((val) => {
                if (imageMarker.includes(val.className) && val.probability >= probabilities[val.className]) {
                    _stop()
                    _triggerToFilterPage()
                }
            })
            window.requestAnimationFrame(_loop);
        }

    }

    const _stop = () => {

        window.cancelAnimationFrame(_loop);
        var stream = videoRef.current.srcObject;
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
        }

        videoRef.current.srcObject = null;
    }

    const _triggerToFilterPage = () => {
        console.log(`Filter Code ${code}`)

        // Trigger Here. pass marker props on deepAr page, to trigger the filter
        window.location = `/pages/filterpage/?filtercode=${code}`
    }


    return (
        <div>
            <Head>
                <title>Teachable Page</title>
            </Head>
            <main>
                <div className="header">
                <img src="/assets/image/top-banner.png" className="top-banner" />
                </div>
                <div className="video">
                    <img src="/assets/image/camera-frame.png" className="camera-frame" />
                    <video
                        muted
                        ref={videoRef}
                        autoPlay
                        playsInline={true}
                        style={{ width:'100%'}}
                        controls={false}
                    />
                </div>
                <div className="footer">
                    <p>將相機對準維多利亞港電視台</p>
                    <p>Aim your camera at the Victoria Harbour TV</p>
                </div>
            </main>
        </div>

    )

}


export default TeachableMachineTracking;