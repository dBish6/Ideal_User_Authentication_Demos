/* User Authentication Demo

   Author: David Bishop
   Creation Date: July 5, 2023
*/

import { useState } from "react";

import "./App.css";

import BlobBundle from "./components/blobBundle/BlobBundle";
import Form from "./components/form";

// What back-end would you like to use; same front-end for every demo.

function App() {
  const [selectedBackEnd, setSelectedBackEnd] = useState({
    javaSpring: true,
    node: false,
  });

  return (
    <main>
      <BlobBundle />
      <Form />
    </main>
  );
}

export default App;
