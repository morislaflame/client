import React, { useState } from 'react';
import './Admin.css';
import CreateBrand from '../../components/modals/CreateBrand';
import CreateModel from '../../components/modals/CreateModel';
import CreateType from '../../components/modals/CreateType';

const Admin = () => {
  const [brandVisible, setBrandVisible] = useState(false)
  const [typeVisible, setTypeVisible] = useState(false)
  const [modelVisible, setModelVisible] = useState(false)
  return (
    <div className={'container'}>
        <button onClick={() => setTypeVisible(true)}>Добавить тип</button>
        <button onClick={() => setBrandVisible(true)}>Добавить бренд</button>
        <button onClick={() => setModelVisible(true)}>Добавить модель</button>
        <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
        <CreateModel show={modelVisible} onHide={() => setModelVisible(false)}/>
        <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
    </div>
  );
};

export default Admin;