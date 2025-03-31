import Upload from "../artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import axios from "axios";
import { Contract, ethers } from "ethers";
import "./FileUpload.css";
import add from "./address.json" with { type: "json" };

const FileUpload = () => {
  const [account, setAccount] = useState("");
  const [user, setUser] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [fileName, setFileName] = useState("No Document selected");

  const handleNameChange = async (e) => {
    setUser(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `5dd3a097cfb3098f60b6`,
            pinata_secret_api_key: `2f3d12c108a2ba9d2e0a4887c94075af79e265f591e519c966e454d0faa6f137`,
            "Content-Type": "multipart/form-data",
          },
        });
        const url = `https://tan-objective-cattle-479.mypinata.cloud/ipfs/${resFile.data.IpfsHash}`;

        const r = await contract.certifyFile(user, resFile.data.IpfsHash, url);
        alert("Certificate uploaded Successfully");
        console.log("Certificate uploaded Successfully", r);
        setFileName("No Document selected");
        setFile(null);
      } catch (e) {
        alert(e.reason);
      }
    }
    setFileName("No image selected");
    setFile(null);
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
    console.log(e.target);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  const fun = async () => {
    try {
      const dta = await contract.getAllCert();

      if (!dta || !Array.isArray(dta)) {
        throw new Error("Invalid data received from contract");
      }
      const formattedData = dta.map((cert) => ({
        user: cert.user,
        issuer: cert.issuer,
        fileHash: cert.fileHash,
        timestamp: new Date(Number(cert.timestamp) * 1000).toLocaleString(), // Convert BigInt timestamp
        url: cert.url,
      }));
      setData(formattedData);
    } catch (error) {
      alert(error.reason);
    }
   
  };
  // useEffect(() => {

  //   fun();
  // }, [fileName]);

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = add["add"];

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      <div className="container">
        <h1 className="h1s">Upload Certificates</h1>
        <h2 className="cacc">
          Current Account : {account ? account : "Not connected"}
        </h2>

        <div className="top">
          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="file-upload" className="choose">
                Choose Document
              </label>
              <input
                disabled={!account}
                type="file"
                id="file-upload"
                name="data"
                onChange={retrieveFile}
              />
            </div>
            <div>
              <span className="textArea">Document: {fileName}</span>
              <button className="btn" type="submit" disabled={!file}>
                Upload File
              </button>
            </div>
            <div>
              <label htmlFor="name">Address:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter address"
                value={user}
                onChange={handleNameChange}
              />
            </div>
          </form>
        </div>
        <div className="certListHeader">
          <span>Uploaded Certificates: (count:{data.length})</span>
          <button className="btn" onClick={fun}>
            Update List
          </button>
        </div>

        {data.length > 0 ? (
          data.map((cert, index) => (
            <div className="entry">
              <h3>Index {index + 1}</h3>
              <div>
                <div>Student Address :</div>
                <div>{cert.user}</div>
              </div>
              <div>
                <div>Issuer :</div>
                <div>{cert.issuer}</div>
              </div>
              <div>
                <div>Hash :</div>
                <div>{cert.fileHash}</div>
              </div>
              <div>
                <div>Creation Date :</div>
                <div>{cert.timestamp}</div>
              </div>
              <div>
                <div>Link :</div>
                <a href={cert.url}>{cert.url}</a>
              </div>
            </div>
          ))
        ) : (
          <div className="entry">
            <h3>No Certificates found</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;
