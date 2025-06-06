import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';

export default function Home() {
  return (
    <>
      <Head>
        <title>A</title>
        <meta name='description' content='ChatGPT Proxy' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <h1>Hello World</h1>
        </div>
      </main>
    </>
  );
}
