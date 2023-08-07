import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Files from "@/components/Files";

export default function Home() {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef(null);

  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileToUpload, { filename: fileToUpload.name });
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      setCid(ipfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  const loadRecent = async () => {
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      setCid(json.ipfs_pin_hash);
    } catch (e) {
      console.log(e);
      alert("trouble loading files");
    }
  };

  return (
    <>
      <Head>
        <title>Pinata Next.js App</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <main className="container">
        <div>
          <h1>Welcome to Pinata</h1>
          <p>
            This is a Next.js template app for{" "}
            <a
              href="https://pinata.cloud"
              rel="noopener noreferrer"
              target="_blank"
            >
              Pinata.
            </a>{" "}
            Update the <span className="code">.env.local</span> file to set your
            Pinata API key and (optionally) your IPFS gateway URL, restart the
            app, then click the Upload button and you'll see uploads to IPFS
            just work™️. If you've already uploaded files, click Load recent to
            see the most recently uploaded file.
          </p>
          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <div className="flex-btns">
            <button
              disabled={uploading}
              onClick={() => inputFile.current.click()}
              className="btn"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button onClick={loadRecent} className="btn btn-light">
              Load recent
            </button>
          </div>
        </div>
        {cid && (
          <div className="file-list">
            <Files cid={cid} />
          </div>
        )}
        <div className="grid">
          <div className="card">
            <div className="card-img">
              <Image
                src="/floating_pinnie.png"
                alt="Pinnie floating with balloons"
                height="225"
                width="137"
              />
            </div>
            <h3>Read the docs</h3>
            <p>
              SDKs, API reference, and recipes all designed to help you get
              started faster.
            </p>
            <a
              className="btn btn-secondary"
              href="https://docs.pinata.cloud"
              rel="noopener noreferrer"
              target="_blank"
            >
              Explore the docs
            </a>
          </div>
          <div className="card">
            <div className="card-img">
              <Image
                src="/scuba_pinnie.png"
                alt="Pinnie with scuba gear on"
                height="225"
                width="176"
              />
            </div>
            <h3>Pinata dashboard</h3>
            <p>
              Log into your Pinata dashboard to see all your files, configure an
              IPFS gateway, and more.
            </p>
            <a
              className="btn btn-secondary"
              href="https://app.pinata.cloud"
              rel="noopener noreferrer"
              target="_blank"
            >
              Go to the dashboard
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
