import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import Row from "react-bootstrap/esm/Row";
import ThingItem from "./ThingItem/ThingItem";
import './ThingList.css'

const ThingList = observer(() => {
    const {thing} = useContext(Context)
    return (
        <div className="thing-list">
            {thing.things.map(thing =>
                <ThingItem key={thing.id} thing={thing}/>
            )}
        </div>
    );
});

export default ThingList;