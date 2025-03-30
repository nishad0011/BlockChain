import Upload from "../artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import axios from "axios";
import { Contract, ethers } from "ethers";

const FileUpload = () => {
  const [account, setAccount] = useState("");
  const [user, setUser] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleNameChange = async (e) => {
    setUser(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData)

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
        // console.log("resfile",resFile);

        
        // const signer = contract.connect(provider.getSigner())
      //   const estimatedGas = await contract.estimateGas.certifyFile(user,resFile.data.IpfsHash, url);
      //   const r = await contract.certifyFile(user,resFile.data.IpfsHash, url, {
      //     gasLimit: estimatedGas // Use the estimated gas
      // });

      console.log("type=",typeof(resFile.data.IpfsHash))
      const r = await contract.certifyFile(user,resFile.data.IpfsHash, url)

        console.log("Certificate uploaded Successfully", r);
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert(e);
        console.log(e);
      }
    }
    alert("Successfully Image Uploaded");
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
        let contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

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
      <div>Upload Certificate</div>
      <p style={{ color: "red" }}>
        Account : {account ? account : "Not connected"}
      </p>

      <div className="top">
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="file-upload" className="choose">
            Choose Image
          </label>
          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
          />
          <span className="textArea">Image: {fileName}</span>
          <button type="submit" className="upload" disabled={!file}>
            Upload File
          </button>
          <br />
          <label htmlFor="name">Address:</label>
          <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter address"
                value={user}
                onChange={handleNameChange}
            />
        </form>
        
      </div>
    </>
  );
};

export default FileUpload;
