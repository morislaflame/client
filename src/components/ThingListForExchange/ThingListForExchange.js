import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../index";
import styles from './ThingListForExchange.module.css';
import ThingItemForExchange from "../ThingItemForExchange/ThingItemForExchange";

const ThingListForExchange = observer(({ selectedThingId, onSelectThing }) => {
    const { thing } = useContext(Context);

    const handleSelect = (thingId) => {
        const newSelectedThingId = selectedThingId === thingId ? null : thingId;
        onSelectThing(newSelectedThingId); 
    };

    return (
        <div className={styles.thing_list}>
            {thing.things.map(t => (
                <div key={t.id} className={styles.thing_item}>
                    <div className={styles.thing_item_button}>
                        <ThingItemForExchange thing={t} />
                        <button 
                            variant={selectedThingId === t.id ? 'success' : 'primary'}
                            onClick={() => handleSelect(t.id)}
                            className={styles.button}
                        >
                            {selectedThingId === t.id ? 'Выбрано' : 'Выбрать'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default ThingListForExchange;
