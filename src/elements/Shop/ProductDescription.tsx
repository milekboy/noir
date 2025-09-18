import { Nav, Tab } from "react-bootstrap";
import IMAGES from "../../constant/theme";
import ProductTabStyleOne from "./ProductTabStyleOne";
import Comments from "../Post/Comments";

export default function ProductDescription() {
  return (
    <div className="dz-tabs">
      <Tab.Container defaultActiveKey={"description"}>
        <Nav as="ul" className="nav-tabs center">
          <Nav.Item as="li">
            <Nav.Link as="button" eventKey={"description"}>
              Description
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
                        <Nav.Link as="button" eventKey={"review"}>Reviews</Nav.Link>
                    </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={"description"}>
            {/* <ProductTabStyleOne productImages={[]} description="" name="" price="" category="" _id="" /> */}
            <div className="tab-pane active" id="description">
              <div className="row">
                <div className="col-lg-12">
                  <p
                    className="m-b30"
                    style={{
                      textAlign: "center",
                    }}
                  >
                   A versatile and comfortable designed for everyday wear. Made from soft, breathable cotton fabric, it offers a relaxed fit that keeps you cool and stylish all day long. Perfect for pairing with jeans, shorts, or layering under jackets, this classic tee is a wardrobe essential for casual and effortless style
                  </p>
                </div>
              </div>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey={"review"}>
            <Comments />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
