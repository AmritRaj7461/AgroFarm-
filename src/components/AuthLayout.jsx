import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative h-screen w-full flex">

      {/* Background image */}
      <img
        src="/auth_photot.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover "
      />

      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main content over image */}
      <div className="relative z-10 flex w-full px-10 m-5 rounded-2xl ">


        <div className="flex items-center justify-center w-full">

          {/* Left: Website Text / Description */}
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-white drop-shadow-xl max-w-md">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Our Platform
              </h1>
              <p className="text-lg">
                Discover a smarter way to manage your online presence.
                Engage, connect, and grow with powerful tools designed for modern creators.
              </p>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[500px] bg-transparent p-8 rounded-xl ">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
