import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head';
import styles from '../../styles/Home.module.css';

export default function Home() {

    const [isUploading, setIsUploading] = useState(false)
    const [isPreview, setIsPreview] = useState(false)
    const [imageLink, setImageLink] = useState('')


    useEffect(() => {
        _isStarting()
    })

    const _isStarting = () => {
        window.deepAR.onVideoStarted = function () {
            console.log("VIDEO")
        };
    }

    const _takeSceenShoot = async () => {
        window.deepAR.takeScreenshot()
        window.deepAR.onScreenshotTaken = async function (photo) {
            const base64Response = await fetch(photo)
            const blob = await base64Response.blob()
            _uploadTos3(blob)
        };
    }

    const _uploadTos3 = async (blob) => {
        let s3URL = await fetch(
            "https://ztjyg3beya.execute-api.ap-east-1.amazonaws.com/dev/presigned_url",
            {
                method: "POST",
            }
        );

        s3URL = await s3URL.json();
        let uploadResult = await fetch(s3URL.url, {
            method: "PUT",
            headers: {
                "Content-Type": "image/jpeg",
            },
            body: blob,
        });

        setIsPreview(true)
        setImageLink(`https://devb-upload.s3.ap-east-1.amazonaws.com/${s3URL.filename}`)
        console.log(`https://devb-upload.s3.ap-east-1.amazonaws.com/${s3URL.filename}`)
    }

    const _closePreview = () => {
        setIsPreview(false)
        window.location.reload()
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Filter Page</title>
            </Head>
            <main style={{ height: '100vh' }}>
                {!isPreview ? (
                    <div style={{ display: 'flex' }}>
                        <img src="/assets/image/TV.png" style={{ position:'absolute', width: '100%', alignSelf: 'center', justifyContent:'center'}} />
                        <canvas className="deepar" id="deepar-canvas" style={{ height: '100vh', }} onClick={_takeSceenShoot}> </canvas>
                    </div>
                ) : (
                        <div>
                            <div className='img-prev' className="deepar" id="deepar-canvas" style={{ height: '100vh' }}>
                                <p style={{ position: 'absolute', left: 20, fontSize: 25, fontWeight: 'bold', color: 'white' }} onClick={_closePreview}>X</p>
                                <img src={imageLink} />
                            </div>
                        </div>
                    )
                }
                <script type="text/javascript" src="/ass/lib/deepar.js"></script>
                <script type="text/javascript" src="/ass/app/app.js"></script>
            </main>
        </div>
    )
}

