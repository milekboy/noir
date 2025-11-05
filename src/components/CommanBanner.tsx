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
      // style={{backgroundImage:`url(${image})`}}
      style={{ backgroundColor: "white" }}
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
