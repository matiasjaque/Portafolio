import React, { useState, useEffect } from 'react';

import {Pie} from '@ant-design/charts';


function Grafico(props) {

    var datax = [];
    datax = [{
        type: 'Con asignación',
        value: Number(props.data) ,
    },
    {
        type: 'Sin asignación',
        value: 100 - Number(props.data) ,
    }];


    const dataGrafico = datax;

    const configGrafica = {
        appendPadding: 0,
        data: dataGrafico,
        angleField: 'value',
        colorField: 'type',
        width: 287,
        height: 227,
        radius: 0.8,
        textAlign:'left',
        fontSize: 9,
        label:{
            type:'inner',
            offset: '-0.5',
            content: '{percentage}',
            style:{
                fill: 'black',
                fontSize: 13,
                //textAlign: 'center',
                alignSelf: 'start',
                justifyContent:'start',
            }
        }
    }

  return (
    <Pie {...configGrafica}/>
  )
}

export default Grafico;