import { StaticImageData } from "next/image";
import Link from "next/link";

interface texttype {
  image: string | StaticImageData;
  mainText: string;
  parentText: string;
  currentText: string;
}

const CommanBanner = ({
  image,
  mainText,
  parentText,
  currentText,
}: texttype) => {
  return (
    <div
      className="dz-bnr-in bg-secondar overlay-black-ligh py-3"
      style={{
        backgroundImage: `url(https://res.cloudinary.com/dbpjskran/image/upload/v1729679011/cld-sample-2.jpg)`,
      }}
      // style={{ backgroundColor: "white" }}
    >
      <div className="container  d-flex justify-content-center align-items-center py-2">
        <div className="dz-bnr-inr-entry  w-lg-25">
          <h1 className="text-center">{mainText}</h1>
          <nav className="breadcrumb-row text-center">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/"> {parentText}</Link>
              </li>
              <li className="breadcrumb-item">{currentText}</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CommanBanner;
