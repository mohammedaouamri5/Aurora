import axios from "axios";
import { useState } from "react";

const UserCreation = () => {
  const [firstname, setFirstname] = useState('');

  const submit = () => {
    console.log("Submitting with firstname:", firstname);

    if (typeof firstname !== 'string') {
      console.error("Invalid input value:", firstname);
      return;
    }

    axios.post("https://100.84.234.49:8443/create-user", {
      Name: firstname,
    })
    .then((res) => {
      console.log("Server response:", res.data);
    })
    .catch((err) => {
      console.error("Request error:", err);
    });
  };

  return (
    <>
      <label>
        Name:
        <input
          name="Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </label>
      <button onClick={submit}>Create User</button>
    </>
  );
};

export default UserCreation;

