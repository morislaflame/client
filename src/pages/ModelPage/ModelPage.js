import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchModelProductById } from '../../http/modelProductAPI';
import FaqAccordion from '../../components/FuctionalComponents/FaqAccordion/FaqAccordion';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import BackButton from '../../components/UI/BackButton/BackButton';
import styles from './ModelPage.module.css';
import { FloatButton } from 'antd';
import PurchaseSectionContainer from '../../components/ModelPageComponents/PurchaseSectionContainer';
import ModelImages from '../../components/ModelPageComponents/ModelImages';
import ModelPlatforms from '../../components/ModelPageComponents/ModelPlatforms';
import ModelInfo from '../../components/ModelPageComponents/ModelInfo';
import AdminSection from '../../components/ModelPageComponents/AdminSection';
import SellerRoute from '../../components/ModelPageComponents/SellerRoute';

const ModelPage = observer(() => {
  const [models, setModels] = useState({ info: {}, images: [], adultPlatforms: [], country: {} });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { model, user } = useContext(Context);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  
    fetchModelProductById(id).then(data => {
      setModels(data);
      setLoading(false);
    });
  
    if (user.isAuth) {
      model.loadBasket();
    }
  }, [id, model, user.isAuth]);

  const isAdmin = user.isAuth && user.user.role === 'ADMIN';

  return (
    <div className={styles.thing_content}>
      <div className={styles.topic_back}>
        <BackButton style={{padding: '0'}}/>
        <h2 className={styles.topic}>{models.name}</h2>
      </div>
      <div className={styles.main_model}>
        <ModelImages images={models.images} />

        <div className={styles.description}>
          <div className={styles.brands_n_type}>
            <ModelPlatforms adultPlatforms={models.adultPlatforms} />
            {models.country && (
              <div className={styles.type_item}>
                <span>Where she's from:</span>
                <div className={styles.type}><span>{models.country.name}</span></div>
              </div>
            )}
          </div>
          {models.info && <ModelInfo info={models.info} />}
        </div>

        {models.status === 'AVAILABLE' && models.moderationStatus === 'APPROVED' && (
          <PurchaseSectionContainer
            modelId={id}
            priceUSD={models.priceUSD}
          />
        )}
        <SellerRoute seller={models.seller} />
      </div>

      {isAdmin && (
        <AdminSection 
          modelId={models.id}
          modelInfo={models.info}
          loading={loading}
        />
      )}

      <FloatButton.BackTop type='dark' />
      <FaqAccordion className={styles.accord} />
    </div>
  );
});

export default ModelPage;
