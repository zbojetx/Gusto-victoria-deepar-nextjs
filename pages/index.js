import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';

const URL = 'https://storage.googleapis.com/tm-model/gh4SD1u8v/';
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

const imageMarker = [
    "Bigtv",
    "TV",
    "Sticker",
    "Frank",
    "Mummy",
    "Vampire",
    "Witch",
    "Pumpkin",
    "Boy",
    "Girl",
    "Cat",
]

function TeachableMachineTracking() {

    const videoRef = useRef()
    let model;

    useEffect(() => {
        _init()
    }, [])

    const _init = async () => {

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
                Bigtv: 0.95,
                TV: 0.95,
                Sticker: 0.95,
                Frank: 0.9,
                Mummy: 1,
                Vampire: 0.9,
                Witch: 0.9,
                Pumpkin: 0.9,
                Boy: 0.9,
                Girl: 0.99,
                Cat: 0.9,
            };
            prediction.forEach((val) => {
                if (imageMarker.includes(val.className) && val.probability >= probabilities[val.className]) {
                    //_stop()
                    _triggerToFilterPage(val.className)
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

    const _triggerToFilterPage = (markerName) => {

      // Trigger Here. pass marker props on deepAr page, to trigger the filter

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