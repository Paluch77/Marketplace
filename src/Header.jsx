import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect } from "react";

function Header(props) {
  const [actualUser, setUser] = useState({
    nick: "",
    photo: "",
  });

  const firstLine = useRef(null);
  const secondLine = useRef(null);
  const navOpen = useRef(null);
  const auth = getAuth();
  const userFirebase = auth.currentUser;
  const db = getFirestore();
  const storage = getStorage();
  let navigate = useNavigate();
  const pathURL = getCurrentURL();
  const signOutButton = (
    <button
      onClick={() => signOutFunc()}
      className="absolute right-0 bottom-0  m-2 rounded-xl bg-classic-blue py-2 px-6 text-lg text-white"
    >
      Sign out
    </button>
  );

  const userData = (
    <div>
      <li className="flex  ">
        <img
          className="mr-4 h-8 w-8 rounded-2xl"
          src={actualUser.photo}
          alt="profilePhoto"
        />
        <p className=" rounded-xl bg-classic-blue px-4 text-center text-white">
          {actualUser.nick}
        </p>
      </li>
      {pathURL.includes("/new_product") ? (
        " "
      ) : (
        <li
          onClick={() => {
            navigate("/new_product");
          }}
          className="my-4"
        >
          Dodaj produkt
        </li>
      )}
    </div>
  );

  const styles = (element, styleName, type = "add") => {
    type === "remove"
      ? styleName.split(" ").forEach((elem) => {
          element.classList.remove(elem);
        })
      : styleName.split(" ").forEach((elem) => {
          element.classList.add(elem);
        });
  };

  function getCurrentURL() {
    return window.location.href;
  }

  const signOutFunc = () => {
    signOut(auth).then(() => {
      window.location.reload();
    });
  };

  const turnOn = () => {
    const translateOff = "translate--off";
    const firstLineTransition = "translate-y-1.5 rotate-45";
    const secondLineTransition = "-translate-y-1.5 -rotate-45 w-8";
    const secondLineTransitionRemove = "w-6";

    if (firstLine.current.classList.contains("translate--off")) {
      styles(firstLine.current, firstLineTransition);
      styles(secondLine.current, secondLineTransition);
      styles(secondLine.current, secondLineTransitionRemove, "remove");
      firstLine.current.classList.remove(translateOff);
    } else {
      styles(firstLine.current, firstLineTransition, "remove");
      styles(secondLine.current, secondLineTransition, "remove");
      styles(secondLine.current, secondLineTransitionRemove);
      firstLine.current.classList.add(translateOff);
    }

    if (navOpen.current.classList.contains("-translate-x-full")) {
      styles(navOpen.current, "-translate-x-full", "remove");
      styles(navOpen.current, "-translate-x-0");
    } else {
      styles(navOpen.current, "-translate-x-0", "remove");
      styles(navOpen.current, "-translate-x-full");
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (userFirebase !== null) {
        console.log(userFirebase);
        const nickRef = doc(db, "users", userFirebase.uid);
        getDoc(nickRef).then((data) => {
          const nickNameone = data.data().profileInfo.nickName;
          setUser({ ...actualUser, nick: nickNameone });
        });
        getDownloadURL(
          ref(storage, userFirebase.uid + "/userPhoto/profilePhoto")
        )
          .then((url) => {
            setUser((actual) => ({ ...actual, photo: url }));
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("not logged");
        setUser("not logged");
      }
    });
  }, [userFirebase]);

  return (
    <header>
      <div className="relative flex h-20 cursor-pointer items-center shadow-md">
        <figure
          onClick={() => {
            navigate("/home");
          }}
          className="relative flex basis-1/2 items-center pl-2"
        >
          <div className="z-10 h-16 w-16 bg-logo bg-cover "></div>
          <figcaption className=" z-10 text-2xl font-bold text-titles">
            Market
          </figcaption>
        </figure>
        <figure className="flex grow items-center justify-end  ">
          <div className="h-8 w-8 bg-shopping-cart bg-cover"></div>
          <div className="rounded-50 flex h-6 w-6 items-center justify-center rounded-full bg-classic-blue">
            <span className="text-sm font-bold text-white">0</span>
          </div>
        </figure>
        <nav className="z-10 flex h-16 w-16 items-center justify-center ">
          <div
            onClick={() => {
              turnOn();
            }}
            className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-3xl bg-white p-2 hover:bg-slate-200"
          >
            <div className="space-y-2">
              <span
                ref={firstLine}
                className="translate--off block h-1 w-8 origin-center rounded-full bg-titles transition-transform ease-in-out"
              ></span>
              <span
                ref={secondLine}
                className="block h-1 w-6 origin-center rounded-full bg-classic-blue transition-transform ease-in-out"
              ></span>
            </div>
          </div>
        </nav>

        <nav
          ref={navOpen}
          className=" absolute left-0 top-0 h-screen w-screen -translate-x-full transform bg-white pt-20 shadow-md duration-300"
        >
          <ul className="space-y-6 px-4 pt-4 text-lg text-titles">
            <li>
              <input
                className="w-full  rounded-xl border-2 py-2 px-2 duration-300 hover:border-classic-blue"
                type="text"
                placeholder="Search..."
              ></input>
            </li>
            <li>Pages</li>
            <li>
              <div>Categories</div>
            </li>
            <li>
              <a>Popular</a>
            </li>
            <li>
              {" "}
              {pathURL.includes("/signup") ? (
                " "
              ) : userFirebase ? (
                " "
              ) : (
                <Link to="/signup">Log In | Sign Up</Link>
              )}
            </li>
            {userFirebase ? userData : ""}
          </ul>
          {userFirebase ? signOutButton : ""}
        </nav>
      </div>
    </header>
  );
}

export default Header;
