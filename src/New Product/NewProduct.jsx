import React from "react";
import Validate from "./validate";
import { useRef, useState } from "react";
import Header from "../Header";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function NewProduct() {
  const [photosState, setPhotos] = useState({
    photos: {},
    files: {},
  });
  const [displayAlbum, setDisplay] = useState();
  const [progressState, setProgress] = useState("0%");
  const fieldStyles =
    "h-12 w-full rounded-xl border-2 border-solid pl-4 outline-none duration-300 focus:border-classic-blue mb-4";
  const [validate, setValidate] = useState({
    title: { styles: fieldStyles, stateInput: false },
    price: { styles: fieldStyles, stateInput: false },
    delivery: { styles: fieldStyles, stateInput: false },
    contact: { styles: fieldStyles, stateInput: false },
    localization: { styles: fieldStyles, stateInput: false },
    description: { styles: fieldStyles, stateInput: false },
  });

  const title = useRef();
  const price = useRef();
  const delivery = useRef();
  const contact = useRef();
  const photos = useRef();
  const description = useRef();
  const localization = useRef();
  const auth = getAuth();
  const imageCoverDiv = useRef();

  const labelStyles = "mb-4 text-xl font-medium";

  const fieldStylesActive =
    "h-12 w-full rounded-xl border-2 border-solid pl-4 outline-none duration-300 border-green-500 mb-4";

  const fieldStylesDeactive =
    "h-12 w-full rounded-xl border-2 border-solid pl-4 outline-none duration-300 border-red-500 mb-4";
  const randomID = () => {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + S4() + S4();
  };

  const deletePhoto = (e, file) => {
    e.preventDefault();
    let object = { ...photosState };
    Object.keys(object.photos).forEach((elem) => {
      if (elem === file.name) {
        delete object.photos[elem];
      }
    });
    Object.keys(object.files).forEach((elem) => {
      if (elem === file.name) {
        delete object.files[elem];
      }
    });
    setPhotos(object);
  };

  const rotateClassGenerator = (angle, classes, file) => {
    const width = imageCoverDiv.current.clientWidth;
    const height = imageCoverDiv.current.clientHeight;
    if (angle === 0) {
      return `${classes} rotate-0 `;
    } else if (angle === 90) {
      return `${classes} rotate-90  w-28`;
    } else if (angle === 180) {
      return `${classes} rotate-180`;
    } else if (angle === 270) {
      return `${classes} -rotate-90 w-28`;
    } else if (angle === 360) {
      return `${classes} rotate-0`;
    }
  };

  const rotatePhoto = (e, file) => {
    e.preventDefault();
    let object = { ...photosState };
    Object.keys(object.photos).forEach((elem) => {
      if (elem === file.name) {
        let item = object.photos[elem];
        if (item.photoRotate === 360) {
          item.photoRotate = 0;
          item.photoRotate += 90;
        } else {
          item.photoRotate += 90;
        }
      }
    });
    setPhotos(object);
    previewPhotos(object);
  };

  const previewPhotos = (e) => {
    const files = e.target ? e.target.files : e;
    const photoList = { photos: {}, files: {} };

    const stateLength = Object.keys(photosState.files).length;
    if (files !== e && stateLength + files.length <= 5) {
      Object.values(files).forEach((file) => {
        let src = URL.createObjectURL(file);
        let image = (
          <div className="relative h-1/2 w-1/2" key={file.name}>
            <div ref={imageCoverDiv} className="absolute h-full w-full p-1">
              <img
                className="m-auto h-full w-min rounded-sm"
                src={src}
                alt="imputedPhoto"
              ></img>
            </div>
            <div className="z-5 absolute right-0 top-0 flex h-full flex-col justify-between p-1">
              <button
                onClick={(e) => {
                  deletePhoto(e, file);
                }}
                className=" m-1 h-8 w-8  rounded-3xl bg-white text-center text-classic-blue opacity-50 duration-300 hover:opacity-100"
              >
                X
              </button>
              <button
                onClick={(e) => {
                  rotatePhoto(e, file);
                }}
                className="m-1 h-8 w-8 rounded-3xl bg-white text-center text-classic-blue opacity-50 duration-300 hover:opacity-100"
              >
                R
              </button>
            </div>
          </div>
        );
        photoList.photos[file.name] = {
          photoReactElement: image,
          photoRotate: 0,
        };
        photoList.files[file.name] = file;
      });
    } else {
      Object.values(photosState.files).forEach((file) => {
        let rotateElement = photosState.photos;
        let fileName = file.name;
        let rotate = rotateElement[fileName].photoRotate;

        let imgClass = rotateClassGenerator(
          rotate,
          "h-full w-min m-auto rounded-sm",
          file
        );

        let src = URL.createObjectURL(file);
        let image = (
          <div className="relative h-1/2 w-1/2" key={file.name}>
            <div ref={imageCoverDiv} className="absolute h-full w-full p-1">
              <img className={imgClass} src={src} alt="imputedPhoto"></img>
            </div>
            <div className="z-5 absolute right-0 top-0 flex h-full flex-col justify-between p-1">
              <button
                onClick={(e) => {
                  deletePhoto(e, file);
                }}
                className=" m-1 h-8 w-8  rounded-3xl bg-white text-center text-classic-blue opacity-50 duration-300 hover:opacity-100"
              >
                X
              </button>
              <button
                onClick={(e) => {
                  rotatePhoto(e, file);
                }}
                className="m-1 h-8 w-8 rounded-3xl bg-white text-center text-classic-blue opacity-50 duration-300 hover:opacity-100"
              >
                R
              </button>
            </div>
          </div>
        );
        photoList.photos[file.name] = {
          photoReactElement: image,
          photoRotate: rotate,
        };
        photoList.files[file.name] = file;
      });
    }

    setPhotos((prevState) => {
      return {
        photos: Object.assign(prevState.photos, photoList.photos),
        files: Object.assign(prevState.files, photoList.files),
      };
    });
    return photoList;
  };

  useEffect(() => {
    setDisplay(
      Object.values(photosState.photos).map((value) => {
        return value.photoReactElement;
      })
    );
  }, [photosState]);

  const writeData = () => {
    const db = getFirestore();
    const productID = randomID();
    const storage = getStorage();
    let images = [];
    let imagePaths = [];
    console.log(productID);
    console.log(`users/` + auth.currentUser.uid + "/products/" + productID);

    Object.values(photosState.files).forEach((elem) => {
      images.push(elem);
      let dupa = uploadBytesResumable(
        ref(storage, `products/${productID}/${elem.name}`),
        elem
      );
      dupa.on(
        `state_changed`,
        (snap) => {
          const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(`${progress}%`);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(
            ref(storage, `products/${productID}/${elem.name}`)
          ).then((url) => {
            imagePaths.push(url);
            if (imagePaths.length == images.length) {
              console.log(imagePaths);
            }
            setDoc(
              doc(
                db,
                `users/` + auth.currentUser.uid + "/products/" + productID
              ),
              {
                title: title.current.value,
                price: price.current.value,
                delivery: delivery.current.value,
                contact: contact.current.value,
                localization: localization.current.value,
                description: description.current.value,
                imagePaths: imagePaths,
              }
            );
          });
        }
      );
    });
  };

  const submitForm = (e) => {
    console.log("title", title.current.value);
    console.log(auth.currentUser.uid);
    e.preventDefault();
    writeData();
  };

  const validateForm = (e) => {
    const val = Validate();
    console.log(val);
    console.log(e.target.value, e.target.name);
    let state = { ...validate };
    let name = e.target.name;
    let value = e.target.value;

    if (name === "title" && value.length < 5) {
      state[name].styles = fieldStylesDeactive;
      state[name].stateInput = false;
    } else {
      state[name].styles = fieldStylesActive;
      state[name].stateInput = true;
    }

    setValidate(state);
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
                  name="title"
                  className={validate.title.styles}
                  onBlur={(e) => {
                    validateForm(e);
                  }}
                  type="text"
                  placeholder="Enter the title..."
                />
              </li>
              <li>
                <label className={labelStyles} htmlFor="price">
                  Price
                </label>
                <input
                  ref={price}
                  className={validate.price.styles}
                  type="number"
                />
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
                <div className="mb-4 flex h-64 w-full flex-wrap rounded-lg border-2 border-solid duration-500">
                  {displayAlbum}
                </div>
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
                <div
                  className="mb-2 h-1 rounded-xl bg-classic-blue duration-300"
                  style={{ width: `${progressState}`, duration: 500 }}
                ></div>
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
