import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import Row from "react-bootstrap/esm/Row";
import ThingItem from "./ThingItem/ThingItem";

const ThingList = observer(() => {
    const {thing} = useContext(Context)
    return (
        <Row style={{display: "flex", flexDirection: 'row'}}>
            {thing.things.map(thing =>
                <ThingItem key={thing.id} thing={thing}/>
            )}
        </Row>
    );
});

export default ThingList;