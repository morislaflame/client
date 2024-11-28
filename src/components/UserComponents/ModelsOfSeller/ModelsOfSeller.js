import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { THING_ROUTE } from '../../../utils/consts';
const ModelsOfSeller = ({ models }) => {
   const navigate = useNavigate();
    return (
       <div>
           <h3>Модели продавца</h3>
           <Row>
               {models.map(model => (
                   <Col key={model.id} md={4} className="mb-4">
                       <Card 
                           className="h-100 cursor-pointer" 
                           onClick={() => navigate(THING_ROUTE + '/' + model.id)}
                           style={{ cursor: 'pointer' }}
                       >
                           <Card.Img 
                               variant="top" 
                               src={process.env.REACT_APP_API_URL + model.images[0]?.img} 
                               style={{ height: '200px', objectFit: 'cover' }}
                           />
                           <Card.Body>
                               <Card.Title>{model.name}</Card.Title>
                               <div className="d-flex justify-content-between align-items-center">
                                   <span className="text-primary fw-bold">
                                       ${model.priceUSD}
                                   </span>
                                   <small className="text-muted">
                                       {model.country?.name}
                                   </small>
                               </div>
                               <div className="mt-2">
                                   {model.adultPlatforms?.map(platform => (
                                       <span 
                                           key={platform.id} 
                                           className="badge bg-secondary me-1"
                                       >
                                           {platform.name}
                                       </span>
                                   ))}
                               </div>
                           </Card.Body>
                       </Card>
                   </Col>
               ))}
           </Row>
       </div>
   );
};
export default ModelsOfSeller;