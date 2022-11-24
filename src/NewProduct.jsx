import React from "react";
import { useRef, useState } from "react";
import Header from "./Header";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { useEffect } from "react";

function NewProduct() {
  const [photosState, setPhotos] = useState("");
  const title = useRef();
  const price = useRef();
  const delivery = useRef();
  const contact = useRef();
  const photos = useRef();
  const description = useRef();
  const localization = useRef();
  const auth = getAuth();

  const labelStyles = "mb-4 text-xl font-medium";
  const fieldStyles =
    "h-12 w-full rounded-xl border-2 border-solid pl-4 outline-none duration-300 focus:border-classic-blue mb-4";

  const randomID = () => {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + S4() + S4();
  };

  const deletePhoto = (e) => {
    e.preventDefault();
    console.log(photosState);
  };

  const previewPhotos = (e) => {
    const files = e.target.files;
    const photoList = [];
    const album = (
      <div className="mb-4 flex h-64 w-full flex-wrap rounded-lg border-2 border-solid duration-500">
        {photoList}
      </div>
    );
    Object.values(files).forEach((file) => {
      let src = URL.createObjectURL(file);
      photoList.push(
        <div className="relative h-1/2 w-1/2" key={file.name}>
          <div className="absolute h-full w-full p-1">
            <img
              className="h-full w-full rounded-sm"
              src={src}
              alt="imputedPhoto"
            ></img>
          </div>
          <div className="z-5 absolute right-0 top-0 flex h-full flex-col justify-between p-1">
            <button
              onClick={(e) => {
                deletePhoto(e);
              }}
              className=" m-1 h-8 w-8  rounded-3xl bg-white text-center text-classic-blue opacity-50 duration-300 hover:opacity-100"
            >
              X
            </button>
            <button className="m-1 h-8 w-8 rounded-3xl bg-white text-center text-classic-blue opacity-50 duration-300 hover:opacity-100">
              R
            </button>
          </div>
        </div>
      );
    });
    setPhotos((dupa) => {
      return Object.assign(dupa, album);
    });
    console.log(photosState);
  };

  useEffect(() => {}, [photosState]);

  const writeData = () => {
    const db = getFirestore();
    const productID = randomID();
    console.log(productID);
    console.log(`users/` + auth.currentUser.uid + "/products/" + productID);
    setDoc(
      doc(db, `users/` + auth.currentUser.uid + "/products/" + productID),
      {
        title: title.current.value,
        price: price.current.value,
        delivery: delivery.current.value,
        contact: contact.current.value,
      }
    );
  };

  const submitForm = (e) => {
    console.log("title", title.current.value);
    e.preventDefault();
    writeData();
  };

  return (
    <>
      <div>
        <Header />
        <h1 className="mt-10 text-center text-2xl font-bold text-titles">
          Dodaj Produkt
        </h1>
        <div className="mt-20 flex flex-col items-center justify-center">
          <form className="flex h-auto w-3/4 flex-col justify-center rounded-sm p-8 shadow-2xl">
            <ul>
              <li>
                <label className={labelStyles} htmlFor="title">
                  Title
                </label>
                <input
                  ref={title}
                  className={fieldStyles}
                  type="text"
                  placeholder="Enter the title..."
                />
              </li>
              <li>
                <label className={labelStyles} htmlFor="price">
                  Price
                </label>
                <input ref={price} className={fieldStyles} type="number" />
              </li>
              <li>
                <label className={labelStyles} htmlFor="delivery">
                  Delivery
                </label>
                <input ref={delivery} className={fieldStyles} type="text" />
              </li>
              <li>
                <label className={labelStyles} htmlFor="contact">
                  Contact
                </label>
                <input ref={contact} className={fieldStyles} type="text" />
              </li>
              <li>
                <label className={labelStyles} htmlFor="localization">
                  Localization
                </label>
                <input ref={localization} className={fieldStyles} type="text" />
              </li>
              <li className="flex flex-col">
                <label className={labelStyles} htmlFor="photos">
                  Photos
                </label>
                {photosState}
                <input
                  onChange={(e) => previewPhotos(e)}
                  ref={photos}
                  className="mb-4 hidden h-12 w-full rounded-xl border-2 border-solid pl-4 outline-none duration-300 focus:border-classic-blue"
                  multiple
                  type="file"
                />
                <span
                  onClick={() => {
                    photos.current.click();
                  }}
                  className="mb-4 flex h-12 w-full items-center justify-center rounded-xl border-2 border-solid border-classic-blue bg-classic-blue text-white outline-none duration-300 hover:scale-105"
                >
                  Add photos
                </span>
              </li>
              <label className={labelStyles} htmlFor="description">
                Description
              </label>
              <textarea
                ref={description}
                className="mb-4  max-h-24  min-h-full w-full rounded-xl border-2 border-solid p-4 outline-none duration-300 focus:border-classic-blue"
                rows="4"
                type="textarea"
              />
              <li>
                <button
                  onClick={(e) => submitForm(e)}
                  className="mb-4 flex h-12 w-full items-center justify-center rounded-xl border-2 border-solid border-classic-blue bg-classic-blue text-white outline-none duration-300 hover:scale-105"
                >
                  Submit
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewProduct;
