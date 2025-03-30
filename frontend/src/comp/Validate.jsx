import Upload from "../artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import axios from "axios";
import { Contract, ethers } from "ethers";
import add from "./address.json" with { type: "json" };


const Validate = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState("");
  const [account, setAccount] = useState("");
  const [hash, setHash] = useState("");
  const [response, setResponse] = useState("");

  const handleHash = (e) => {
    setHash(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputHash = e.target.elements["hashInput"].value; // Get value directly

    console.log("Submitted hash:", inputHash);
    const res = await contract.verifyFile(inputHash);
    setResponse(res);
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
    <div className="container">
      <h1 className="h1s">Validate Certificate</h1>

      <div className="top">
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="inpt">Hash</label>
            <input
              onChange={handleHash}
              id="inpt"
              name="hashInput"
              type="text"
            />
          </div>

          <button className="btn" type="submit" disabled={!hash.length}>
            Check
          </button>
        </form>
      </div>

      {response[0] ? (
        <div className="entry">
          <h3>Found Document</h3>
          <div>
            <div>Student Address :</div>
            <div>{response[0]}</div>
          </div>
          <div>
            <div>Issuer :</div>
            <div>{response[1]}</div>
          </div>
          <div>
            <div>Hash :</div>
            <div>{response[2]}</div>
          </div>
          <div>
            <div>Creation Date :</div>
            <div>{new Date(Number(response[3]) * 1000).toLocaleString()}</div>
          </div>
          <div>
            <div>Link :</div>
            <a href={response[4]}>{response[4]}</a>
          </div>
        </div>
      ) : (
        <div className="entry">
          <h3>No Certificate Found</h3>
        </div>
      )}
    </div>
  );
};

export default Validate;
