import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head';
import styles from '../../styles/Home.module.css';

const overlayImage = [
    '/assets/image/Filter-frame/frame1.png',
    '/assets/image/Filter-frame/frame2.png',
    '/assets/image/Filter-frame/frame3.png',
    '/assets/image/Filter-frame/frame4.png',
]

export default function Home() {

    const [isUploading, setIsUploading] = useState(false)
    const [isPreview, setIsPreview] = useState(false)
    const [imageLink, setImageLink] = useState('')
    const [code, setCode] = useState()


    useEffect(() => {
        _isStarting()
    })

    const _isStarting = async () => {
        const filterIndex = localStorage.getItem('filtercode')
        setCode(filterIndex)
        window.deepAR.onVideoStarted = function () {
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
            <main style={{ height: '100vh', width: '100%' }}>
                {!isPreview ? (
                    <div style={{ display: 'flex' }}>
                        <img className="frame-overlay" id="frame-overlay" src={overlayImage[code]} />
                        <canvas className="deepar" id="deepar-canvas" />
                        <div className="take-button" onClick={_takeSceenShoot}>
                        </div>
                    </div>
                ) : (
                        <div>
                            <div className='img-prev' className="deepar" id="deepar-canvas">
                                <p style={{ position: 'absolute', left: 20, fontSize: 25, fontWeight: 'bold', color: 'white' }} onClick={_closePreview}>X</p>
                                <img src={imageLink} />
                                <div style={{ bottom: 30, position: 'absolute',borderRadius: 5, alignItems:'center', width: '100%', padding: 7}}>
                                    <div style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                        長按相片收藏並與家人朋友分享吧！<br />
                                        Long press the photo to save and share with your family and friends!
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                <script type="text/javascript" src="/lib/deepar.js"></script>
                <script type="text/javascript" src="/app/app.js"></script>
            </main>
        </div>
    )
}

