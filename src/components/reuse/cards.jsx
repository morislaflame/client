import React from 'react'
import './cards.css'

export default function Cards(props) {
  return (
        <div className='advList'>
            <div className='pic'></div>
                <div className='txt'>
                    <h3>{props.cards.title}</h3>
                    <p>
                        {props.cards.description}
                    </p>
                </div>
        </div>
  )
}
