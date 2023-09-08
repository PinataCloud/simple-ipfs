import Head from 'next/head';
import React, { useRef, useState, useEffect } from 'react'
import mime from 'mime';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : "https://gateway.pinata.cloud";

const CID = ({ fileData }) => {
  const [href, setHref] = useState("");
  const downloadRef = useRef(null);

  useEffect(() => {
    if(href) {
      downloadRef.current.click();
    }
  }, [href]);
  
  const download = async () => {
    const res = await fetch(`${GATEWAY_URL}/ipfs/${fileData.ipfs_pin_hash}?download=true`);    
    const extension = mime.getExtension(res.headers.get('content-type'))
    const blob = await res.blob();

    const supportsFileSystemAccess =
      'showSaveFilePicker' in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();
    // If the File System Access API is supported…
    if (supportsFileSystemAccess) {
      try {        
        const handle = await showSaveFilePicker({
          suggestedName: `${fileData.ipfs_pin_hash}.${extension}`,
        });        
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {        
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
          const blobUrl = URL.createObjectURL(blob); 
          setHref(blobUrl);   
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Simple IPFS</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <main className="m-auto flex min-h-screen w-full flex-col items-center justify-center">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center bg-cover bg-center">
          <div className="h-full max-w-screen-xl">
            <div className="m-auto flex h-full w-full items-center justify-center">
              <div className="m-auto w-3/4 text-center">
                <h1>Download file</h1>
                <p className="mt-2">
                  Please make sure you trust the source of this link. If you don't know who sent you the link and are unsure what will be downloaded, do not click the download button.
                </p>
                <a className="hidden" href={href} ref={downloadRef} download={fileData.originalName} />
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center align-center flex h-64 w-3/4 m-auto flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light">
                  <h2 className="text-3xl">{fileData.metadata.name}</h2>
                  <h3 className="mb-8">{fileData.metadata.keyvalues.description}</h3>
                  <button                    
                    onClick={download}
                    className="underline"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const pinataSDK = require("@pinata/sdk");
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
  // Fetch data from external API    
  const response = await pinata.pinList(    
    {
      hashContains: context.query.cid
    }
  );
  
  const fileData = response.rows[0];
  return { props: { fileData } }
}

export default CID