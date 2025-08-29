import { Nav, Tab } from "react-bootstrap";
import IMAGES from "../../constant/theme";
import ProductTabStyleOne from "./ProductTabStyleOne";
import Comments from "../Post/Comments";

export default function ProductDescription(){
    return(
        <div className="dz-tabs">		
            <Tab.Container defaultActiveKey={"description"}>
                <Nav as="ul" className="nav-tabs center">
                    <Nav.Item as="li">
                        <Nav.Link as="button" eventKey={"description"}>Description</Nav.Link>
                    </Nav.Item>
                    {/* <Nav.Item as="li">
                        <Nav.Link as="button" eventKey={"review"}>Reviews (12)</Nav.Link>
                    </Nav.Item> */}
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey={"description"}>
                        {/* <ProductTabStyleOne productImages={[]} description="" name="" price="" category="" _id="" /> */}
                    </Tab.Pane>

                    <Tab.Pane eventKey={"review"}>
                        <Comments />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}