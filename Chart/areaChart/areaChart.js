/**
 * 区域图
 * @param chartDom js文档对象，例如var chartDom=document.getElementById('areaChartBox');
 * @param startTime 开始时间,例如 var startTime='2014/8';
 * @param endTime 结束时间,例如 var endTime='2015/8';
 * @param data 这段时间内的数据，例如 var data=[10000,50000,80000,10000,20000,5300,15000,18000,19000,17000,23000,30000];
 * @author wanzh
 */
function areaChart(chartDom,startTime,endTime,data){
    var diameter=12;
    var maxY=data[0];
    var minY=data[0];
    for(var i=1;i<data.length;i++){
        if(maxY){
            if(data[i]&&data[i]>maxY){
                maxY=data[i];
            }
        }else{
            maxY=data[i];
        }
        if(minY){
            if(data[i]&&data[i]<minY){
                minY=data[i];
            }
        }else{
            minY=data[i];
        }
    }
    if(maxY==0||minY==0){
        maxY=50;
        minY=0;
    }
    var top=20;
    var left=50;
    var right=30;
    var bottom=30;
    var yHeight=125;
    if(minY<0){
        var yTotalNum=maxY-minY;
        var ph=yHeight/yTotalNum;
    }else{
        var yTotalNum=maxY;
        var ph=yHeight/yTotalNum;
    }

    var height=yHeight+bottom+top;
    var width = chartDom.offsetWidth;
    var totalMonth=data.length;
    var yWidth=width-left-right;
    var pw=yWidth/(totalMonth-1);

    var color='#B6A35D';
    var xmlns = "http://www.w3.org/2000/svg";
    var svgElem = document.createElementNS(xmlns, "svg");
    svgElem.setAttributeNS(null, "width",  width);
    svgElem.setAttributeNS(null, "height", height);
    svgElem.setAttributeNS(null, "preserveAspectRatio", 'none');

    //画矩形，填充背景
    var rect=document.createElementNS(xmlns,'rect');
    rect.setAttributeNS(null, "x",  0);
    rect.setAttributeNS(null, "y",  0);
    rect.setAttributeNS(null, "width",  width);
    rect.setAttributeNS(null, "height", height);
    rect.setAttributeNS(null, "stroke", "#f6f6f6");
    rect.setAttributeNS(null, "stroke-width", "0");
    rect.setAttributeNS(null, "fill", "#f6f6f6");
    svgElem.appendChild(rect);

    //计算圆的中心点
    var posArr=new Array();
    var posIndex=0;
    for (var i = 0; i < data.length; i++) {
        if(minY<0){
            data[i]-=minY;
        }
        if(data[i]==0||data[i]){
            var posObj = {};
            posObj.x = pw * i;
            posObj.y = yHeight-ph*data[i]+top;
            posArr[posIndex]=posObj;
            posIndex++;
        }
    }

    //画路径
    var pathP='';
    var areaP='';
    for (var i = 0; i < posArr.length; i++) {
        var pos = posArr[i];
        if(i==0){
            pathP+='M'+pos.x+','+pos.y;
            areaP+='M'+pos.x+','+(yHeight+top);
            areaP+=' '+'L'+pos.x+' , '+pos.y;
        }else if(i==posArr.length-1){
            pathP+=' '+'L'+pos.x+','+pos.y;
            areaP+=' '+'L'+pos.x+','+pos.y;
            areaP+=' '+'L'+pos.x+','+(yHeight+top);
        }else{
            pathP+=' '+'L'+pos.x+' , '+pos.y;
            areaP+=' '+'L'+pos.x+' , '+pos.y;
        }
    }
    areaP+='Z';
    var gElem=document.createElementNS(xmlns, "g");
    gElem.setAttributeNS(null, "transform", 'translate('+left+',0)');

    var path=document.createElementNS(xmlns, "path");
    path.setAttributeNS(null, "d", pathP);
    path.setAttributeNS(null, "stroke",color);
    path.setAttributeNS(null, "fill", "transparent");
    path.setAttributeNS(null, "stroke-width", "2");
    gElem.appendChild(path);

    var area=document.createElementNS(xmlns, "path");
    area.setAttributeNS(null, "d", areaP);
    area.setAttributeNS(null, "stroke","transparent");
    area.setAttributeNS(null, "fill", "#F2EFDF");
    area.setAttributeNS(null, "stroke-width", "2");
    gElem.appendChild(area);

    //画圆
    for (var i = 0; i < posArr.length; i++) {
        var pos = posArr[i];
        var circle = document.createElementNS(xmlns, "circle");
        circle.setAttributeNS(null, "cx", pos.x);
        circle.setAttributeNS(null, "cy", pos.y);
        circle.setAttributeNS(null, "r", "5");
        circle.setAttributeNS(null, "stroke",color);
        circle.setAttributeNS(null, "fill", "#fff");
        circle.setAttributeNS(null, "stroke-width", "2");
        gElem.appendChild(circle);
    }

    //画X轴
    var xAxis=document.createElementNS(xmlns, "g");
    xAxis.setAttributeNS(null, "transform", 'translate('+left+','+(yHeight+top)+')');
    var xLine=document.createElementNS(xmlns,"line");
    xLine.setAttributeNS(null,'x1','0');
    xLine.setAttributeNS(null,'x2',yWidth);
    xLine.setAttributeNS(null,'y1','2');
    xLine.setAttributeNS(null,'y2','2');
    xLine.setAttributeNS(null,'stroke','#C0BDAD');
    xLine.setAttributeNS(null,'fill','transparent');
    xLine.setAttributeNS(null,'stroke-width','1');
    xLine.setAttributeNS(null,'stroke-dasharray','2');
    xAxis.appendChild(xLine);
    for(var i=0;i<totalMonth;i++){
        var polygon = document.createElementNS(xmlns, "polygon");
        var points=(i*pw-1)+','+2;
        points+=' '+(i*pw)+','+0;
        points+=' '+(i*pw+1)+','+2;
        polygon.setAttributeNS(null, "points", points);
        polygon.setAttributeNS(null, "stroke","#000");
        polygon.setAttributeNS(null, "fill", "#000");
        polygon.setAttributeNS(null, "stroke-width", "1");
        xAxis.appendChild(polygon);
    }

    var startTimeText=document.createElementNS(xmlns,"text");
    startTimeText.setAttributeNS(null,'x', '0');
    startTimeText.setAttributeNS(null,'y','20');
    startTimeText.setAttributeNS(null,'font-size','14');
    startTimeText.setAttributeNS(null,'text-anchor','middle');
    startTimeText.setAttributeNS(null,'fill','#000');
    var textRData = document.createTextNode(startTime);
    startTimeText.appendChild(textRData);
    xAxis.appendChild(startTimeText);

    var endTimeText=document.createElementNS(xmlns,"text");
    endTimeText.setAttributeNS(null,'x', yWidth);
    endTimeText.setAttributeNS(null,'y','20');
    endTimeText.setAttributeNS(null,'font-size','14');
    endTimeText.setAttributeNS(null,'text-anchor','middle');
    endTimeText.setAttributeNS(null,'fill','#000');
    var textRData = document.createTextNode(endTime);
    endTimeText.appendChild(textRData);
    xAxis.appendChild(endTimeText);

    //画Y轴，画水平线
    var yAxis=document.createElementNS(xmlns, "g");
    var yNum=[];
    var yDf=yTotalNum/5;
    var mNum=parseInt(maxY/2.5);
    for(var i=0;i<5;i++){
        if(minY>=0){
            yNum[i]=Math.round((i+1)*yDf);
        }else{
            yNum[i]=Math.round((i+1)*yDf+minY);
        }

        console.log(yNum[i]);
        if(yNum[i]>=100000000||yNum[i]<=-100000000){
            yNum[i]=(yNum[i]/100000000);
            console.log(yNum[i]);
            if(!parseInt(yNum[i])==yNum[i]){
                yNum[i]=yNum[i].toFixed(1);
            }
            yNum[i]+='亿';
        }else if(yNum[i]>=10000||yNum[i]<=-10000){
            yNum[i]=(yNum[i]/10000);
            console.log(yNum[i]);
            if(!parseInt(yNum[i])==yNum[i]){
                yNum[i]=yNum[i].toFixed(1);
            }

            yNum[i]+='万';

        }
    }

    for(var i=0;i< yNum.length;i++){
        var posY=yHeight-(yHeight/5)*(i+1)+top;
        var yText=document.createElementNS(xmlns,"text");
        yText.setAttributeNS(null,'x', left-5);
        yText.setAttributeNS(null,'y',posY);
        yText.setAttributeNS(null,'font-size','14');
        yText.setAttributeNS(null,'text-anchor','end');
        yText.setAttributeNS(null,'fill','#000');
        var textRData = document.createTextNode(yNum[i]);
        yText.appendChild(textRData);
        yAxis.appendChild(yText);

        var xLine=document.createElementNS(xmlns,"line");
        xLine.setAttributeNS(null,'x1','0');
        xLine.setAttributeNS(null,'x2',yWidth);
        xLine.setAttributeNS(null,'y1',posY);
        xLine.setAttributeNS(null,'y2',posY);
        xLine.setAttributeNS(null,'stroke','#C0BDAD');
        xLine.setAttributeNS(null,'fill','transparent');
        xLine.setAttributeNS(null,'stroke-width','1');
        xLine.setAttributeNS(null,'stroke-dasharray','2');
        gElem.appendChild(xLine);
    }

    svgElem.appendChild(gElem);
    svgElem.appendChild(xAxis);
    svgElem.appendChild(yAxis);

    chartDom.appendChild(svgElem);
}