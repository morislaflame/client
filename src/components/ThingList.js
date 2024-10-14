import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import ThingItem from "./ThingItem/ThingItem";
import { Skeleton } from 'antd';
import './ThingList.css'


const ThingList = observer(({ loading }) => {
    const { thing } = useContext(Context);

    return (
        <div className="thing-list">
            {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="thing-item-skeleton">
                        <Skeleton.Image style={{ width: '100%', height: '200px' }} active />
                        <Skeleton active paragraph={{ rows: 1, width: '80%' }} />
                    </div>
                ))
            ) : (
                thing.things.map(thing =>
                    <ThingItem key={thing.id} thing={thing} />
                )
            )}
        </div>
    );
});

export default React.memo(ThingList);
