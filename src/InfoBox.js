import React from 'react'
import  {Card,CardContent,Typography} from "@material-ui/core"
import "./InfoBox.css"
function InfoBox({ title, cases, total,active, isRed,...props}) {
  return (
    <Card
     className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}
      onClick={props.onClick}
    >
      <CardContent>
        {/* Title */}
        <Typography color="textSecondary" className="infoBox__title">
          {title}
        </Typography>

        {/* Number of Cases */}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

        {/* Total cases */}
        <Typography color="textSecondary" className="infoBox__total">
          {total} Total
      </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
