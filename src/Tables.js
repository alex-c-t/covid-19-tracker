import numeral from 'numeral';
import React from 'react';
import './tables.css';

const Tables = ({countries}) => {
    
    return (
        <div className ="tables">
            {countries.map(({country, cases})=>(
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Tables
