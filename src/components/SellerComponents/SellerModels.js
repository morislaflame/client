import React, { useEffect, useContext, useState, useCallback } from 'react';
import { List, Button, Popconfirm, message, Spin, Dropdown } from 'antd';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { SlOptionsVertical } from 'react-icons/sl';
import styles from './SellerComponents.module.css';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

const SellerModels = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    user.fetchSellerThings();
  }, [user]);

  useEffect(() => {
    console.log('Seller Things Data:', user.sellerThings);
  }, [user.sellerThings]);

  const handleDropdownVisibleChange = useCallback((flag, thingId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [thingId]: flag,
    }));
  }, []);

  const handleMenuClick = useCallback(
    async (action, thingItem) => {
      if (action === 'edit') {
        navigate(`/seller/edit-model/${thingItem.id}`);
      } else if (action === 'delete') {
        try {
          await user.deleteThing(thingItem.id);
          message.success('Model deleted successfully');
        } catch (error) {
          message.error('Error deleting model');
        }
      }

      setOpenDropdowns((prevState) => ({
        ...prevState,
        [thingItem.id]: false,
      }));
    },
    [navigate, user]
  );

  const getDropdownMenu = useCallback(
    (thingItem) => ({
      items: [
        {
          key: 'edit',
          label: 'Edit',
          onClick: () => handleMenuClick('edit', thingItem),
        },
        {
          key: 'delete',
          label: 'Delete',
          danger: true,
          onClick: () => handleMenuClick('delete', thingItem),
        },
      ],
    }),
    [handleMenuClick]
  );

  

  const { sellerThings } = user;

//   if (user.loading) {
//     return <LoadingIndicator />;
//   }

  return (
    <div className={styles.my_things}>
      <h3>My Models</h3>
      {sellerThings && sellerThings.length > 0 ? (
        <div className={styles.things_list}>
          {sellerThings.map((thingItem) => (
            <div className={styles.thing_item} key={thingItem.id}>
              <div className={styles.thing_image_wrapper}>
                {thingItem.images && thingItem.images.length > 0 && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${thingItem.images[0].img}`}
                    alt={thingItem.name}
                    className={styles.thing_image}
                    onClick={() => navigate(`/thing/${thingItem.id}`)}
                  />
                )}
              </div>
              <div className={styles.thing_details}>
                <div className={styles.name_price}>
                  <span>{thingItem.name}</span>
                  <span>${thingItem.price}</span>
                </div>
                <div className={styles.dropdownmenusection}>
                  <Dropdown
                    menu={getDropdownMenu(thingItem)}
                    trigger={['click']}
                    onOpenChange={(flag) => handleDropdownVisibleChange(flag, thingItem.id)}
                    open={openDropdowns[thingItem.id] || false}
                  >
                    <div className={styles.dropdownmenu}>
                      <div onClick={(e) => e.preventDefault()} className={styles.dropdownTrigger}>
                        <span>Actions</span>
                        <SlOptionsVertical
                          className={`${styles.rotateIcon} ${
                            openDropdowns[thingItem.id] ? styles.open : ''
                          }`}
                        />
                      </div>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span className={styles.placeholder}>You don't have any Models.</span>
      )}
    </div>
  );
});

export default SellerModels;
