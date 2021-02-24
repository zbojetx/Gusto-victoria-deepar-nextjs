import { useEffect, useRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
            </Head>
            <main>
                <canvas className="deepar" id="deepar-canvas" ></canvas>

                <script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
                <script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
                <script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
                <script type="text/javascript" src="/ass/lib/deepar.js"></script>
                <script type="text/javascript" src="/ass/app/app.js"></script>
            </main>


        </div>
    )
}
