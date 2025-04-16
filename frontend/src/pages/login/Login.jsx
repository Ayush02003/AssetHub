import { useState } from "react";
// import { Link } from "react-router-dom";
import useLogin from "../../hooks/UseLogin";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password, role);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen ">
      <div className="w-96 p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-xl lg:max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-700 ">
          AssetHub - Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label mt-1">
              <span className="text-base label-text text-gray-500">Email</span>
            </label>
            <input
              type="text"
              placeholder="Email Address"
              className="w-full input input-bordered bg-white text-gray-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="!mt-3">
            <label className="label !pt-0 ">
              <span className="text-base label-text text-gray-500">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered bg-white text-black text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="!mt-3">
            <label className="label !pt-0">
              <span className="text-base label-text text-gray-500">Role</span>
            </label>
            <select
              className="w-full input input-bordered bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option className="bg-gray-100 text-gray-700" value="Admin">
                Admin
              </option>
              <option className="bg-gray-100 text-gray-700" value="HR">
                HR
              </option>
              <option className="bg-gray-100 text-gray-700" value="IT-Person">
                IT-Person
              </option>
              <option className="bg-gray-100 text-gray-700" value="Employee">
                Employee
              </option>
            </select>
          </div>
          <a
            href="/forget_password"
            className="text-xs text-gray-600 hover:underline hover:text-blue-600"
          >
            Forget Password?
          </a>
          <div>
            <button
              className="btn btn-block btn-sm mt-2 text-white "
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
