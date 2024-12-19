import { observer } from "mobx-react-lite";
import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import { Context } from "../../../index";
import ModelItem from "../ModelItem/ModelItem";
import { fetchModelProducts } from '../../../http/modelProductAPI';
import ModelsSkeletonsArray from '../../UI/Skeletons/ModelsSkeletonsArray';
import gsap from 'gsap';

const ModelList = observer(() => {
    const { model } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        gsap.fromTo(".thing-list", {
            opacity: 0,
            y: 25,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'back.inOut'
        })
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const loadThings = async () => {
            setLoading(true);
            try {
                const data = await fetchModelProducts(
                    model.selectedCountry.id,
                    model.selectedAdultPlatforms,
                    model.page,
                    20,
                    model.priceRange.min,
                    model.priceRange.max
                );
                model.setModelProducts(data.rows);
                model.setTotalCount(data.count);
            } catch (error) {
                console.error('Error loading models:', error);
            } finally {
                setLoading(false);
            }
        };

        loadThings();
    }, [model.page, model.selectedCountry, model.selectedAdultPlatforms, model.priceRange]);

    return (
        <div className="thing-list">
            {loading ? (
                <ModelsSkeletonsArray count={20} />
            ) : (
                model.modelProducts.map(model =>
                    <ModelItem key={model.id} model={model}/>
                )
            )}
        </div>
    );
});

export default React.memo(ModelList);
