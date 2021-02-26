import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas'

export default function Home() {

    const [isUploading, setIsUploading] = useState(false)
    const [isPreview, setIsPreview] = useState(false)
    const [imageLink, setImageLink] = useState('')

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


    return (
        <div className={styles.container}>
            <Head>
                <title>Filter Page</title>
            </Head>
            <main>

                {!isPreview ? (
                    <div>
                        {/* <img src="/assets/image/TV.png"  style={{ position:'absolute',  transform: `rotate(90deg)`, bottom: 0, top: 0 }} /> */}
                        <canvas className="deepar" id="deepar-canvas" style={{ height: '100vh', }} ></canvas>
                        <button onClick={_takeSceenShoot} id='take-screenshoot' >  Screenshoot</button>
                    </div>
                ) : (
                        <div>
                            <div className='img-prev' className="deepar" id="deepar-canvas" style={{ height: '100vh' }}>
                                <img src={imageLink} />
                            </div>
                        </div>
                    )}

                <script type="text/javascript" src="/ass/lib/deepar.js"></script>
                <script type="text/javascript" src="/ass/app/app.js"></script>
            </main>
        </div>
    )
}

