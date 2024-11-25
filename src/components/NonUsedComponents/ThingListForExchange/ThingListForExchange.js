import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../index";
import styles from './ThingListForExchange.module.css';
import ThingItemForExchange from "../ThingItemForExchange/ThingItemForExchange";
import { Skeleton } from 'antd'; // Импортируем Skeleton
import { fetchThings } from '../../../http/NonUsedAPI/thingAPI'; // Импортируем fetchThings

const ThingListForExchange = observer(({ selectedThingId, onSelectThing }) => {
    const { thing } = useContext(Context);
    const [loading, setLoading] = useState(true); // Состояние загрузки

    useEffect(() => {
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

    const handleSelect = (thingId) => {
        const newSelectedThingId = selectedThingId === thingId ? null : thingId;
        onSelectThing(newSelectedThingId); 
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          }
    };

    return (
        <div className={styles.thing_list}>
            {loading ? (
                Array.from({ length: 20 }).map((_, index) => (
                    <div key={index} className={styles.thing_item_skeleton}>
                        <div className={styles.skeleton_image}>
                            <Skeleton.Image style={{ width: '100%', height: '250px' }} active />
                            <Skeleton active paragraph={{ rows: 1, width: '80%' }} />
                        </div>
                    </div>
                ))
            ) : (
                thing.things.map(t => (
                    <div key={t.id} className={styles.thing_item}>
                        <div className={styles.thing_item_button}>
                            <ThingItemForExchange thing={t} />
                            <button 
                                variant={selectedThingId === t.id ? 'success' : 'primary'}
                                onClick={() => handleSelect(t.id)}
                                className={styles.button}
                            >
                                {selectedThingId === t.id ? 'Chosen' : 'Choose'}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});

export default ThingListForExchange;
