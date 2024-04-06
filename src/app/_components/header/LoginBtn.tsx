'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";

import LoginModal from "./LoginModal";

export default function LoginBtn() {
  const [isLoginModal, setIsLoginModal] = useState(false);

  const openModalHandler = () => {
    setIsLoginModal(true);
  }
  
  const closeModalHandler = () => {
    setIsLoginModal(false);
  }

  const loginHandler = () => {
    signIn("kakao");
  }

  return (
    <>
      <button
        className="border-[1.5px] border-default px-5 py-2 rounded-md text-xs md:text-sm"
        type="button"
        onClick={openModalHandler}
      >로그인</button>
      {isLoginModal && (
        <LoginModal closeModalHandler={closeModalHandler} loginHandler={loginHandler} />
      )}
    </>
  );
}