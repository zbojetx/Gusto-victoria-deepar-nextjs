import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import * as tmImage from '@teachablemachine/image';
import { useRouter } from 'next/router';
import { isChrome, isSafari, isAndroid, isIOS } from "react-device-detect";
import copy from 'copy-to-clipboard';

//const URL = 'https://storage.googleapis.com/tm-model/gh4SD1u8v/';
const URL = 'https://storage.googleapis.com/tm-model/gh4SD1u8v/';
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

const imageMarker = [
    "TV",
]

const safariLogo = '/assets/image/safari.png';
const chromeLogo = '/assets/image/chrome.png';

function TeachableMachineTracking() {

    const [isLoading, setIsLoading] = useState(true)
    const videoRef = useRef()
    let model, code;

    const router = useRouter();

    useEffect(() => {

        if (isIOS && !isSafari) {
            alert("COPY LINK BRO")
        } else if (isAndroid && !isChrome) {
            alert("Copy Link Bellow")
            //window.location.href = `googlechrome://navigate?url=${window.location.href}`;
        } else {
            if (router.isReady) {
                console.log('ready')
                code = router.query.code
                _init()
            }
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

    const _copyLink = () => {
        copy(window.location.href)
        alert("Link Copied")
    }


    return (
        <div>
            <Head>
                <title>Teachable Page</title>
            </Head>

            {isIOS && isSafari || isAndroid && isChrome ?
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
                            style={{ width: '100%' }}
                            controls={false}
                        />
                    </div>
                    <div className="footer">
                        <p>將相機對準維多利亞港電視台</p>
                        <p>Aim your camera at the Victoria Harbour TV</p>
                    </div>
                </main>
                :
                <div className="redirection"  >
                    <img className="browser-logo" src={isIOS ? safariLogo : chromeLogo} />
                    <div>
                        <p className="my-3">
                            {isIOS ? "Open with Safari for iOS to access this content" : "Open with Chrome for Android to access this content"}
                        </p>
                        <p className="mb-2">Tap below to copy the address for easy pasting into {isIOS ? "Safari for iOS" : "Chrome for Android"}</p>
                        <button className="btn" onClick={_copyLink}>Copy Page Link</button>
                    </div>
                </div>
            }

        </div>

    )

}


export default TeachableMachineTracking;