import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import circleRing from "../../Assets/Images/circleRingReverse.png";
import AuthScreen from "../helper/AuthScreen";

const Login = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("pansara52@gmail.com");
  const [password, setPassword] = useState<string>("1234@");

  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      localStorage.removeItem("auth_token");
    }
    if (localStorage.getItem("name")) {
      localStorage.removeItem("name");
    }
    if (localStorage.getItem("email")) {
      localStorage.removeItem("email");
    }
  }, []);

  const loginAction = async () => {
    const validate = loginValidator();
    if (validate.success) {
      setLoader(true);
      await fetch("http://localhost:80/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success) {
            toast.success("Logged In Successfully", {
              position: "bottom-center",
              autoClose: 3000,
            });
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("auth_token", response.token);
            localStorage.setItem("email", email);
            navigate("/panel/url-detector");
          } else {
            toast.error(response.message ?? "Failed to login", {
              position: "bottom-center",
              autoClose: 3000,
            });
          }
        })
        .finally(() => setLoader(false));
    } else {
      toast.error(validate.message, {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  const loginValidator = () => {
    if (!email || email.trim().length === 0) {
      return { success: false, message: "Email is invalid or missing" };
    }

    if (!password || password.trim().length === 0) {
      return { success: false, message: "Password is Missing" };
    }

    return { success: true, message: "All Ok" };
  };

  const handleForgetPassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="flex flex-row flex-wrap w-full min-h-screen">
      <div className="w-[100%] sm:w-[60%] bg-custom-gradient">
        <AuthScreen content="Signup Here" path="register" />
      </div>
      <div className="flex flex-row w-[100%] sm:w-[40%] items-center justify-center mx-auto">
        <img
          src={circleRing}
          className="top-[-80px] sm:top-[-140px] right-0 absolute w-[227px] sm:w-[427px] h-auto"
          alt="circle-ring"
        />
        <div className="w-[90%] sm:w-[60%]">
          <h2 className="font-[700] text-[26px]">Hello Again!</h2>
          <p>Welcome Back</p>

          <div className="flex flex-col w-full mx-auto mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.3">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.5 5.25L2.25 4.5H21.75L22.5 5.25V18.75L21.75 19.5H2.25L1.5 18.75V5.25ZM3 6.8025V18H21V6.804L12.465 13.35H11.55L3 6.8025ZM19.545 6H4.455L12 11.8035L19.545 6Z"
                      fill="#333333"
                    />
                  </g>
                </svg>
              </div>
              <input
                type="email"
                id="login-group-1"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-red-300 block w-full ps-12 p-2.5"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.3">
                    <path
                      d="M20 12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7Z"
                      fill="#333333"
                    />
                  </g>
                </svg>
              </div>
              <input
                type="password"
                id="login-group-12"
                className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full ps-12 p-2.5"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            {loader ? (
              <Spin />
            ) : (
              <button
                className="text-white bg-[#0575E6] hover:bg-custom-gradient px-[26px] py-[18px] rounded-[30px]"
                onClick={loginAction}
              >
                Login
              </button>
            )}

            <button
              onClick={handleForgetPassword}
              className="text-[#333333ba] mt-6"
            >
              Forgot Password ?
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
