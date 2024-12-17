import React from 'react';
import { observer } from "mobx-react-lite";
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import UserModelsList from '../../components/UserComponents/UserModelsList';

const AllUserModelsPage = observer(() => {
    return (
        <div className="container">
            <TopicBack title="My Models" />
            <div className="container-item">
                <UserModelsList />
            </div>
        </div>
    );
});

export default AllUserModelsPage;
