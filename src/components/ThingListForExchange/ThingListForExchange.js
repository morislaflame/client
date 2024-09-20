import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../../index";
import ThingItem from "../ThingItem/ThingItem";
import Button from "react-bootstrap/Button";
import styles from './ThingListForExchange.module.css';
import ThingItemForExchange from "../ThingItemForExchange/ThingItemForExchange";

const ThingListForExchange = observer(({ onSelectThing }) => {
    const { thing } = useContext(Context);
    const [selectedThingId, setSelectedThingId] = useState(null);

    const handleSelect = (thingId) => {
        setSelectedThingId(thingId);
        onSelectThing(thingId); // Передаем выбранный товар родителю
    };

    return (
        <div className={styles.thing_list}>
            {thing.things.map(t => (
                <div key={t.id} className={styles.thing_item}>
                    <div className={styles.thing_item_button}>
                        <ThingItemForExchange thing={t} />
                        <Button 
                            variant={selectedThingId === t.id ? 'success' : 'primary'}
                            onClick={() => handleSelect(t.id)}
                        >
                            {selectedThingId === t.id ? 'Выбрано' : 'Выбрать'}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default ThingListForExchange;
