import Upload from "../artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";
import add from "./address.json" with { type: "json" };


const SeeCert = () => {
  const [account, setAccount] = useState("");
  const [user, setUser] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleNameChange = async (e) => {
    setUser(e.target.value);
  };

  const getCert = async (e) => {
    const dta = await contract.getFile(account);
    const formattedData = dta.map((cert) => ({
      user: cert.user,
      issuer: cert.issuer,
      fileHash: cert.fileHash,
      timestamp: new Date(Number(cert.timestamp) * 1000).toLocaleString(), // Convert BigInt timestamp
      url: cert.url,
    }));
    setData(formattedData);

    console.log("formattedData = ", formattedData);
  };

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
        <h1 className="h1s">See Your Certificates</h1>
        <h2 className="cacc">
          Current Account : {account ? account : "Not connected"}
        </h2>

        <div className="certListHeader">
          <span>Your Certificates: (Found {data.length})</span>
          <button className="btn" onClick={getCert}>
            Get
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

export default SeeCert;
