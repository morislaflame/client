import React from 'react';
import { Button } from 'antd';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { EDIT_THING_ROUTE } from '../../utils/consts';
import styles from './ModelPage.module.css';

const AdminSection = ({ modelId, modelInfo, loading }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.admin_info}>
      <Button
        type="primary"
        onClick={() => navigate(`${EDIT_THING_ROUTE}/${modelId}`)}
        loading={loading}
      >
        <FaEdit /> Edit model
      </Button>
    </div>
  );
};

export default AdminSection;