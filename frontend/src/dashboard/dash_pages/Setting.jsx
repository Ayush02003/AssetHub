import "../../css/setting.css";
import useUserStore from "../../zustand/useUserStore.js";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Setting = () => {
  const { authUser } = useAuthContext();
  
  const {
    users,
    selectedUser,
    fetchUsers,
    viewUser,
    updateUser,
    updatePassword,
  } = useUserStore();
  
  const [userData, setUserData] = useState({
    id:"",
    name: "",
    mobile: "",
    email: "",
    department: "",
    designation: "",
    address: "",                  
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (authUser?.id) {
      fetchUsers(); 
    }
  }, [authUser?.id]);


  useEffect(() => {
    if (users.length > 0 && authUser?.id) {
      viewUser(authUser.id);
    }
  }, [users, authUser?.id]);

  useEffect(() => {
    if (selectedUser) {
      setUserData({
        id:selectedUser._id || "",
        name: selectedUser.name || "",
        mobile: selectedUser.mobile || "",
        email: selectedUser.email || "",
        department: selectedUser.department || "",
        designation: selectedUser.designation || "",
        address: selectedUser.address || "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateUser(userData);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword != passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    await updatePassword(authUser.username,passwordData);
  };
  return (
      <>
        {authUser.role === "Admin" && <h1>Admin Setting</h1>}
    
        {authUser.role !== "Admin" && (
          <div className="main-setting">
            <div className="user-data">
              <p>Personal Information</p>
              <div className="user-info">
                <form onSubmit={handleSave}>
                  <table>
                    <tbody>
                      <tr>
                        <td>Name</td>
                        <td>Phone Number</td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa-regular fa-user"></i>
                          <input
                            required
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <i className="fa fa-phone"></i>
                          <input
                            required
                            type="text"
                            name="mobile"
                            value={userData.mobile}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Email</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <i className="fa-regular fa-envelope"></i>
                          <input
                            required
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Department</td>
                        <td>Designation</td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa-solid fa-building"></i>
                          <input
                            required
                            type="text"
                            name="department"
                            value={userData.department}
                            disabled
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <i className="fa fa-briefcase"></i>
                          <input
                            required
                            type="text"
                            name="designation"
                            value={userData.designation}
                            disabled
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Address</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <i className="fa-regular fa-address-card"></i>
                          <input
                            required
                            type="text"
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="button">
                          <button className="submit" type="submit">
                            Update
                          </button>
                          <input className="reset" type="reset" value="Cancel" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
    
            {/* Change Password Section */}
            <div className="user-pass">
              <p>Change Password</p>
              <div className="pass-info">
                <form onSubmit={handlePassword}>
                  <table>
                    <tbody>
                      <tr>
                        <td>Old Password</td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa fa-lock"></i>
                          <input
                            type="password"
                            name="oldPassword"
                            required
                            placeholder="Old Password"
                            onChange={handlePasswordChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>New Password</td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa fa-key"></i>
                          <input
                            required
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            onChange={handlePasswordChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Confirm Password</td>
                      </tr>
                      <tr>
                        <td>
                          <i className="fa-regular fa-check-square"></i>
                          <input
                            required
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            onChange={handlePasswordChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="button">
                          <button className="submit" type="submit">
                            Change Password
                          </button>
                          <input className="reset" type="reset" value="Cancel" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
    
};

export default Setting;
