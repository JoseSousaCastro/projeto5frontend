import React, { useState } from "react";
import "../Password/Password.css";
import { userStore } from "../../stores/UserStore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function Password() {
  const { t } = useTranslation();
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
      toast.warn(t("passwordsDoNotMatch"));
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
        toast.success(t("passwordUpdateSuccess"));
      } else {
        const responseBody = await response.text();
        console.error(
          "Error updating password:",
          response.statusText,
          responseBody
        );
        alert(t("passwordUpdateFailed"));
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert(t("passwordUpdateFailed"));
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
            {t("changePassword")}
          </label>
          <label className="labels-password" id="currentPass-password-label">
            {t("currentPassword")}
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
            {t("newPassword")}
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
            {t("confirmNewPassword")}
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
            {t("save")}
          </button>
          <button
            type="button"
            id="password-cancel-button"
            onClick={handleCancel}
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Password;
