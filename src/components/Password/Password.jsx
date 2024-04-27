import React, { useState } from "react";
import "../Password/Password.css";
import { userStore } from "../../stores/UserStore";
import { toast } from "react-toastify";

function Password() {
  const [inputs, setInputs] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const username = userStore((state) => state.username);
  const token = userStore((state) => state.token);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { currentPassword, newPassword, newPasswordConfirm } = inputs;

    if (newPassword !== newPasswordConfirm) {
      toast.warn("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/project5/rest/users/update/${username}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
            oldpassword: currentPassword,
            newpassword: newPassword,
          },
        }
      );

      if (response.ok) {
        toast.success("Password updated successfully");
      } else {
        const responseBody = await response.text();
        console.error(
          "Error updating password:",
          response.statusText,
          responseBody
        );
        alert("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
  };

  return (
    <div className="passwordPanel">
      <form
        className="password-register"
        id="password-form"
        onSubmit={handleSubmit}
      >
        <div className="password-fieldsContainer">
          <label className="labels-password" id="change-password-label">
            Change Password
          </label>
          <label className="labels-password" id="currentPass-password-label">
            Current password
          </label>
          <input
            type="password"
            className="password-fields"
            id="currentPassword-password"
            name="currentPassword"
            value={inputs.currentPassword}
            onChange={handleChange}
          />
          <label className="labels-password" id="newPass-password-label">
            New password
          </label>
          <input
            type="password"
            className="password-fields"
            id="newPassword-password"
            name="newPassword"
            value={inputs.newPassword}
            onChange={handleChange}
          />
          <label className="labels-password" id="newPassConfirm-password-label">
            Confirm new password
          </label>
          <input
            type="password"
            className="password-fields"
            id="newPasswordConfirm-password"
            name="newPasswordConfirm"
            value={inputs.newPasswordConfirm}
            onChange={handleChange}
          />
        </div>
        <div className="password-Buttons">
          <button type="submit" id="password-save-button">
            Save
          </button>
          <button
            type="button"
            id="password-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Password;
