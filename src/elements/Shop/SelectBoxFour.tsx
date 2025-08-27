import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export const dataItemValue = [
    {title:"XS", category: "(6)"},
    {title:"S", category: "(8)"},
    {title:"M", category: "(10)"},
    {title:"M/L", category: "(12)"},
    {title:"L", category: "(14)"},
    {title:"XL", category: "(16)"},
    {title:"XXL", category: "(18)"},
];

export default function SelectBoxOne(){
    const [dropValue, setDropValue] = useState("Size");
    return(
        <Dropdown className="select-dropdown" style={{ backgroundColor: "white" }}>
            <Dropdown.Toggle 
                className="dropdown-inner" 
                style={{
                    width: "280px",     // increase width
                    textAlign: "left",  // align text properly
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FFFAF3",
                    border: "1px solid #fff",
                    color: "black"
                }}
            >
                <span className="me-1">{dropValue}</span> 
                <i className="fa-solid fa-angle-down ms-2" />
            </Dropdown.Toggle>
            
            <Dropdown.Menu style={{ width: "280px" }}> 
                {dataItemValue.map((data, ind)=>(
                    <Dropdown.Item 
                        onClick={() => setDropValue(data.title)} 
                        eventKey={"Grid"} 
                        key={ind}
                    ><div>
                        {data.title}
                        <span style={{ float: "right", color: "#888" }}>{data.category}</span>
                     </div>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>  
    )
}
