import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css';

const InfoBox = ({title, cases, total, type, isOrange, isGreen, isRed, active, ...props}) => {
    return (
            <Card onClick = {props.onClick} className = {`infoBox ${active && "infoBox--selected"} ${isOrange && 'infoBox--orange'} ${isGreen && 'infoBox--green'} ${isRed && 'infoBox--red'}`}>
                
                <CardContent>
                    {/* Title */}
                    <Typography className = "infoBox__title" color = "textSecondary">
                        {title}
                    </Typography>

                    <h3 className = {`infoBox__cases ${isGreen && 'infoBox__cases--green'} ${isOrange && 'infoBox__cases--orange'}`}>{cases}</h3>

                    <Typography className = "infoBox__total" color = "textSecondary">
                       Total {type}:{total}
                    </Typography>

                    {/* +120k Number of Cases */}

                    {/* 1.2M Total */}
                </CardContent>
            </Card>
    )
}

export default InfoBox
