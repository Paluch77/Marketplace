import React from "react";
import { useRef, useState, useEffect } from "react";
import Header from "./Header";
import app from "./firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [progressed, setProgress] = useState("0%");

  const email = useRef(null);
  const password = useRef(null);
  const firstName = useRef(null);
  const addFile = useRef(null);
  const lastName = useRef(null);
  const nickName = useRef(null);
  const signUpForm = useRef(null);
  const additionalInfo = useRef(null);
  let init = app;
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  let navigate = useNavigate();
  const user = auth.currentUser;

  const createNewUser = () => {
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((cred) => {
        console.log(cred.user);
        signUpForm.current.classList.remove("flex");
        signUpForm.current.classList.add("hidden");
        additionalInfo.current.classList.remove("hidden");
        additionalInfo.current.classList.add("flex");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const logIn = () => {
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, emailValue, passwordValue).then(() => {
        navigate("/home");
      });
    });
  };

  const userData = async (e) => {
    console.log(auth.currentUser.uid);
    console.log(addFile.current.files);

    const userPhotos = ref(
      storage,
      `${auth.currentUser.uid}/userPhoto/profilePhoto`
    );
    const upload = uploadBytesResumable(userPhotos, addFile.current.files[0]);
    upload.on("state_changed", (snapshot) => {
      const progressUpload =
        Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100) +
        "%";
      setProgress(progressUpload);
      if (progressUpload === "100%") {
        console.log("dziala");
        navigate("/home");
      }
    });

    await setDoc(doc(db, `users`, auth.currentUser.uid), {
      profileInfo: {
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        nickName: nickName.current.value,
      },
    });
  };

  return (
    <div>
      <Header />
      <main className="text-titles">
        <section
          ref={signUpForm}
          className="flex h-min items-center justify-center py-20"
        >
          <ul className=" w-64 space-y-4 rounded-xl p-4 text-sm shadow-xl">
            <li>
              <h1 className=" py-10 text-center text-2xl font-bold">Sign Up</h1>
            </li>
            <li>
              <h1>Please enter your e-mail</h1>
            </li>
            <li>
              <input
                ref={email}
                className="w-full rounded-xl border-2 p-2 duration-300 hover:border-classic-blue"
                type="text"
                placeholder="Email..."
              ></input>
            </li>
            <li>Please enter your password:</li>
            <li>
              <input
                ref={password}
                className="w-full rounded-xl border-2 p-2 duration-300 hover:border-classic-blue"
                type="text"
                placeholder="Password..."
              ></input>
            </li>
            <li>
              <button
                onClick={() => {
                  createNewUser();
                }}
                className="mt-4 w-full rounded-xl bg-classic-blue py-2 font-bold text-white"
              >
                Submit
              </button>
            </li>
            <li className="text-center">
              {" "}
              Do you have account?
              <button
                onClick={() => {
                  logIn();
                }}
                className="mt-4 w-full rounded-xl bg-classic-blue py-2 font-bold text-white"
              >
                {" "}
                Log in{" "}
              </button>
            </li>
          </ul>
        </section>
        <section
          ref={additionalInfo}
          className=" hidden h-min items-center justify-center py-20 "
        >
          <ul className=" w-64 space-y-4 rounded-xl p-4 text-sm shadow-xl">
            <li>
              <h1 className=" py-10 text-center text-2xl">User information</h1>
            </li>
            <li>Nickname</li>
            <li>
              <input
                ref={nickName}
                className="w-full rounded-xl border-2 p-2 duration-300 hover:border-classic-blue"
                type="text"
                placeholder="Nickname..."
              ></input>
            </li>
            <li>
              <h1>Your name</h1>
            </li>
            <li>
              <input
                ref={firstName}
                className="w-full rounded-xl border-2 p-2 duration-300 hover:border-classic-blue"
                type="text"
                placeholder="Name..."
              ></input>
            </li>
            <li>Last name</li>
            <li>
              <input
                ref={lastName}
                className="w-full rounded-xl border-2 p-2 duration-300 hover:border-classic-blue"
                type="text"
                placeholder="Last name..."
              ></input>
            </li>
            <li>Profile photo</li>
            <li>
              <input
                ref={addFile}
                className="w-full rounded-xl border-2 p-2 duration-300 hover:border-classic-blue"
                type="file"
                placeholder="Last name..."
              ></input>
            </li>
            <li>
              <button
                onClick={() => {
                  userData();
                }}
                className="mt-4 w-full rounded-xl bg-classic-blue py-2 font-bold text-white"
              >
                Submit
              </button>
              <div
                className="mt-2 h-1 rounded-xl bg-classic-blue duration-300"
                style={{ width: `${progressed}`, duration: 500 }}
              ></div>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default SignUp;
