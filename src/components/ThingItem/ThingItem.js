import { useNavigate } from "react-router-dom";
import './ThingItem.css'
import { THING_ROUTE } from "../../utils/consts";

const ThingItem = ({thing}) => {
    const navigate = useNavigate()
    return (
        <div className={'card_list'} onClick={() => navigate(THING_ROUTE + "/" + thing.id)}>
            <div className={'card'}>
                <img className={'card_img'} src={process.env.REACT_APP_API_URL + thing.img}/>
                <div className="text-black-50" style={{display: "flex", gap: '10px', marginTop: '20px'}}>
                    <div>C.P Company</div>
                    
                </div>
                <div>
                    {thing.name}
                </div>
            </div>
        </div>
    );
};

export default ThingItem;