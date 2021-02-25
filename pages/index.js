import React, { useState, useEffect, useRef } from 'react'
import * as tmImage from '@teachablemachine/image'
import { useRouter } from 'next/router'
import Filterpage from './pages/filterpage'

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

    //get params from URL

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

            console.log(prediction)

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

    const styles = {
        height: "100vh",
    };

    return (
        <div>
            <video
                muted
                ref={videoRef}
                autoPlay
                playsInline
                style={styles}
                controls={false}
            />
        </div>
    )

}


export default TeachableMachineTracking;