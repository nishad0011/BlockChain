// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

//declare the contract
contract Upload {

  //declare the event that will be fired when a file is certified.
  event FileCertified(string user,address certifier, string fileHash, uint timestamp, string url);

  //declare a structured data that describes a certified file
  struct FileCertificate {
    string user;
    address issuer;
    string fileHash;
    uint timestamp;
    string url;
  }
  mapping(string => FileCertificate[]) public fileCertificatesMap;
  mapping(string => FileCertificate) public allFileCertificates;
  FileCertificate[] public allallCert;

  //declare an object that will store the file certificates by hash
  // mapping (string => FileCertificate) fileCertificatesMap;

  //function that allows users to certify a file
  function certifyFile(string memory _user, string memory fileHash, string memory url) public payable {
    FileCertificate memory newFileCertificate = FileCertificate(_user,msg.sender, fileHash, block.timestamp, url);

    // fileCertificatesMap[user] = newFileCertificate;

    fileCertificatesMap[_user].push(newFileCertificate);
    allFileCertificates[fileHash] = newFileCertificate;
    allallCert.push(newFileCertificate);

  }

  //function that allows users to verify if a file has been certified before
  function verifyFile(string memory fileHash) public view returns (string memory ,address, string memory, uint, string memory) {
    return (
      allFileCertificates[fileHash].user,
      allFileCertificates[fileHash].issuer,
      allFileCertificates[fileHash].fileHash,
      allFileCertificates[fileHash].timestamp,
      allFileCertificates[fileHash].url
    
    );
  }
  function getFile(string memory account) public view returns (FileCertificate[] memory) {
    return (
      fileCertificatesMap[account]
    );
  }


}