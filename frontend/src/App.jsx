import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./comp/FileUpload";
import SeeCert from "./comp/SeeCert";
import Validate from "./comp/Validate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/view" element={<SeeCert />} />
        <Route path="/validate" element={<Validate />} />
      </Routes>
    </Router>
  );
}

export default App;
