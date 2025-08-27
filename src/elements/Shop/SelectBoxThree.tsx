import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export const dataItemValue = [
    {title:"Latest", category: "Products"},
    {title:"Popularity", category: "9 Products"},
    {title:"Average rating", category: "12 Products"},
    {title:"Latest", category: "14 Products"},
    {title:"Low to high", category: "18 Products"},
    {title:"high to Low", category: "24 Products"},
];

export default function SelectBoxOne(){
    const [dropValue, setDropValue] = useState("Latest");
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
                    >
                        {data.title}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>  
    )
}
