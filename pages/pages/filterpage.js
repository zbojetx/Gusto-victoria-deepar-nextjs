import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';

export default function Home() {

    return (
        <div className={styles.container}>
            <Head>
                <title>Filter Page</title>

            </Head>
            <main>
                <canvas className="deepar" id="deepar-canvas" ></canvas>

                <script type="text/javascript" src="/ass/lib/deepar.js"></script>
                <script type="text/javascript" src="/ass/app/app.js"></script>

            </main>


        </div >
    )
}

