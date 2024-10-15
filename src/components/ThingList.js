import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import ThingItem from "./ThingItem/ThingItem";
import { Skeleton } from 'antd';
import { fetchThings } from '../http/thingAPI';
import './ThingList.css';

const ThingList = observer(() => {
    const { thing } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const loadThings = async () => {
            setLoading(true);
            try {
                const data = await fetchThings(
                    thing.selectedType.id,
                    thing.selectedBrands,
                    thing.page,
                    20,
                    thing.priceRange.min,
                    thing.priceRange.max
                );
                thing.setThings(data.rows);
                thing.setTotalCount(data.count);
            } catch (error) {
                console.error('Error loading models:', error);
            } finally {
                setLoading(false);
            }
        };

        loadThings();
    }, [thing.page, thing.selectedType, thing.selectedBrands, thing.priceRange]);

    return (
        <div className="thing-list">
            {loading ? (
                Array.from({ length: 20 }).map((_, index) => (
                    <div key={index} className="thing-item-skeleton">
                        <div className="skeleton-image">
                        <Skeleton.Image style={{ width: '100%', height: '250px', borderRadius: 'calc(var(--index)* 1)' }} active />
                        <Skeleton active paragraph={{ rows: 1, width: '80%' }} />
                        </div>
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
