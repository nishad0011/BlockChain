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
  const [data, setData] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleNameChange = async (e) => {
    setUser(e.target.value);
    
  }
  
 
  const getCert = async (e) => {
    const dta = await contract.getFile(account);
    setData(dta);

    console.log("dta = ",dta);
    console.log(typeof(dta));
  }
  
 

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
      <div>See Certificates</div>
      <p style={{ color: "red" }}>
        Account : {account ? account : "Not connected"}
      </p>
    

      <button onClick={getCert}>Get certificates</button>
        <h1>All certificates</h1>
        <br />

        

      {/* {data.target.map((cert, index) => {

                    <p key={index} className="certificate">
                        <strong>User:</strong> {cert[0]} <br />
                        <strong>Issuer:</strong> {cert[1]} <br />
                        <strong>Timestamp:</strong> {new Date(cert[3] * 1000).toLocaleString()} <br />
                        <strong>Hash::</strong> {cert[2]} bytes <br />
                        <strong>URL::</strong> {cert[4]} bytes <br />
                    </p>
})} */}
      {data}

                {/* {data[0][0]} */}
    </>
  );
};

export default FileUpload;
