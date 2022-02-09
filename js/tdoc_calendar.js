//JS code for perpetual AOWE shift calendar
//Version: 06Feb2022
//Author: Ken Nyman, AOWEB, 571-557-9887, kenneth.d.nyman@nga.mil

var m_skedStart = new Date("October 11, 2015");

var m_teams=["blue","green","red","purple"];


function getSkedPattern(color){
	var thePattern, year = parseInt(document.getElementById("lblYear").innerText);
	//D=days, N=nights, A=weekdays, B=weekends, T=telework;
	console.log("color=" + color + "; year=" + year + "year<2022=", (year < 2022));
	if(color=="red"){
		if(year<2021){
			thePattern=["NB","NB","NB","NA","NA","NA","DB","DB","DB","DA","DA","DA"];
		}else if(year==2021){
			thePattern=["NB","NBT","NB","NAT","NA","NAT","DB","DBT","DB","DAT","DA","DAT"];
		}else{
			thePattern=["NB","NBT","NB","NAT","NA","NAT","DB","DBT","DB","DAT","DA","DAT"];
		}
	}else if(color=="purple"){
		if(year<2021){
			thePattern=["NA","NA","NA","NB","NB","NB","DA","DA","DA","DB","DB","DB"];
		}else if(year==2021){
			thePattern=["NAT","NA","NAT","NB","NBT","NB","DAT","DA","DAT","DB","DBT","DB"];
		}else{
			thePattern=["NAT","NA","NAT","NB","NBT","NB","DAT","DA","DAT","DB","DBT","DB"];
		}
	}else if(color=="blue"){
		if(year<2021){
			thePattern=["DB","DB","DB","DA","DA","DA","NB","NB","NB","NA","NA","NA"];
		}else if(year==2021){
			thePattern=["DBT","DB","DBT","DA","DAT","DA","NBT","NB","NBT","NA","NAT","NA"];
		}else{
			thePattern=["DB","DBT","DB","DAT","DA","DAT","NB","NBT","NB","NAT","NA","NAT"];
		}
	}else if(color=="green"){
		if(year<2021){
			thePattern=["DA","DA","DA","DB","DB","DB","NA","NA","NA","NB","NB","NB"];
		}else if(year==2021){
			thePattern=["DA","DAT","DA","DBT","DB","DBT","NA","NAT","NA","NBT","NB","NBT"];
		}else{
			thePattern=["DAT","DA","DAT","DB","DBT","DB","NAT","NA","NAT","NB","NBT","NB"];
		}
	}
	return thePattern;
}

function Schedules(blue, green, red, purple){
	this.blue=blue;
	this.green=green;
	this.red=red;
	this.purple=purple;
}

function calendarInitialize(theTeam){
	var team;
	if(theTeam!=undefined) m_teams=[theTeam];
	resetTables();
	var theDate=getCurrentYear();
	var today=new Date().setHours(0,0,0,0);
	var nextYear=new Date(theDate.getFullYear()+1, 0,1);
	var aryHolidays=getHolidays(theDate,nextYear);
	//console.log(aryHolidays.length);
	var theWeek=0, currMonth=0;
	var focusY=0;
	while (theDate < nextYear){
		var objSked = new Schedules();
        	var e = document.getElementById("m" + theDate.getMonth() + ".w" + theWeek + ".d" + theDate.getDay());
		e.innerHTML = theDate.getDate() + "<br>";
		e.style.backgroundColor="#EEEEEE";
		if(theDate.getTime()==today){
			e.style.borderColor = "#6C7170";
			focusY= document.getElementById("m" + currMonth).getBoundingClientRect().top;
			console.log("New focusY=" + focusY + "; currMonth=" + currMonth);			
		}
		if(aryHolidays.indexOf(theDate.getTime())>-1){
			//console.log("Match for date " + theDate);
			e.style.color="#AF0000";
		}
		getSkedCodes(objSked, theDate, nextYear);
		for(var i=0; i<m_teams.length; i++){
			team=m_teams[i];
			insertShiftPix(team, objSked[team],e);
		}
		theDate=addDays(theDate,1);
		if(theDate.getDay()==0)	theWeek++;
		if (theDate.getMonth()>currMonth){
			currMonth++;
			theWeek=0;
		}
	}
	console.log("focusY=" + focusY);
	window.scrollTo(0, focusY - 180);
}

function insertShiftPix(theTeam, skedCode, theElement){
	var picPath="";
	var picAlt="";
	switch(skedCode){
		case "D":
			picPath="img/" + theTeam + "Day.png";
			picAlt= theTeam + " Day Shift";
			break;
		case "N":	
			picPath="img/" + theTeam + "Night.png";
			picAlt= theTeam + " Night Shift";
			break;
		case "T":	
			picPath="img/" + theTeam + "Tele.png";
			picAlt= theTeam + " Telework Day";
			break;
	}
	if(picPath.length>0){
		var img = document.createElement('img');
		img.src=picPath;
		img.height=28;
		img.width=28;
		img.alt=picAlt;
		theElement.appendChild(img);
	}
}

function getSkedCodes(objSked, theDate, nextYear){
	//console.log("getSkedCodes theDate=" + theDate + "; nextYear=" + nextYear);
	var thePattern, iWeekNumber = 0, datSunday = new Date(m_skedStart), nextSunday=new Date();
	nextSunday=addDays(datSunday,7);
	while (datSunday < nextYear){
		if(theDate >= datSunday && theDate < nextSunday) break;
		iWeekNumber++;
		if (iWeekNumber > 11) iWeekNumber = 0;
		datSunday=nextSunday;
		nextSunday=addDays(datSunday,7);
	}
	//console.log("getSkedCodes loop break iWeekNumber=" + iWeekNumber);
	for(var i=0; i < m_teams.length; i++){
		switch(m_teams[i]){
			case "blue":
				thePattern=getSkedPattern("blue", nextYear-1);
				objSked.blue=getSkedWeek(thePattern[iWeekNumber], datSunday);
				//console.log("blue iWeekNumber=" + iWeekNumber + "; getSkedWeek=" + objSked.blue + "; slice=" + objSked.blue.slice(theDate.getDay(),theDate.getDay()+1));
				objSked.blue=objSked.blue.slice(theDate.getDay(),theDate.getDay()+1);
				//console.log("objSked.blue=" + objSked.blue);
				break;
			case "green":
				thePattern=getSkedPattern("green", nextYear-1);
				objSked.green=getSkedWeek(thePattern[iWeekNumber], datSunday);
				objSked.green=objSked.green.slice(theDate.getDay(),theDate.getDay()+1);
				break;
			case "red":
				thePattern=getSkedPattern("red", nextYear-1);
				objSked.red=getSkedWeek(thePattern[iWeekNumber], datSunday);
				objSked.red=objSked.red.slice(theDate.getDay(),theDate.getDay()+1);
				break;
			case "purple":
				thePattern=getSkedPattern("purple", nextYear-1);
				objSked.purple=getSkedWeek(thePattern[iWeekNumber], datSunday);
				objSked.purple=objSked.purple.slice(theDate.getDay(),theDate.getDay()+1);
				break;
		}
	}
}	

function getSkedWeek(skedCode, datSunday){
	var result="";
	for(var i=0; i<=6; i++){
		var theDay=addDays(datSunday,i);
		switch(left(skedCode,2)){
			case "DB":
				if (isWeekend(theDay.getDay())){
					//console.log("skedCode=" + skedCode + "; theDay=" + theDay.getDay() + "; isTelework=" + isTelework(skedCode,theDay.getDay(),true));
					result=result + ((isTelework(skedCode,theDay.getDay(),true)) ? "T" : "D");
				}else{
					result=result + "0";
				}
				break;
			case "DA":
				if (isWeekday(theDay.getDay(), true)){
					result=result + ((isTelework(skedCode,theDay.getDay(),true)) ? "T" : "D");
				}else{
					result=result + "0";
				}
				break;
			case "NB":
				if (isWeekend(theDay.getDay())){
					result=result + ((isTelework(skedCode,theDay.getDay(),false)) ? "T" : "N");
				}else{
					result=result + "0";
				}
				break;
			case "NA":
				if (isWeekday(theDay.getDay(), false)){
					result=result + ((isTelework(skedCode,theDay.getDay(),false)) ? "T" : "N");
				}else{
					result=result + "0";
				}
				break;
		}
	}
	return result;
}

function isWeekday(theDayOfWeek, isDayshift){
	var result=false;
	if (isDayshift){
		if ([2,3,4,5].indexOf(theDayOfWeek) >= 0) result=true;
	}else{
		if ([1,2,3,4].indexOf(theDayOfWeek) >= 0) result=true;
	}
	return result;
}

function isWeekend(theDayOfWeek){
	var result=false;
	if ([0,1,5,6].indexOf(theDayOfWeek) >= 0) result=true;
	return result;
}

function isTelework(skedCode, theDayOfWeek, isDayshift){
	var result=false;
	if (right(skedCode,1)!="T") return result;
	if (isDayshift){
		if ([5].indexOf(theDayOfWeek) >= 0) result=true;
	}else{
		if ([1].indexOf(theDayOfWeek) >= 0) result=true;
	}
	return result;
}

function getHolidays(theDate, nextYear){
	var today=new Date(theDate.getFullYear(),0,1);
	var theHoliday=new Date(theDate.getFullYear(),0,1);
	var result=[], bEarlyMemorialDay=false;
	while(today <= nextYear){
		if(today.getMonth()==0 && today.getDate()==1){ //New Year's Day
			if(today.getDay()==0){
				theHoliday=addDays(today,1);
			}else if(today.getDay()==6){
				theHoliday=addDays(today,-1);
			}else{
				theHoliday=addDays(today,0);
			}
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==0 && today.getDay()>0 && today.getDay()<6 && today.getDate()==20 && (today.getFullYear()-2013) % 4==0){ //Inauguration Day
			theHoliday=addDays(today,0);
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==0 && today.getDay()==1 && today.getDate()>14 && today.getDate()<=21){ //MLK's Birthday
			theHoliday=addDays(today,0);
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==1 && today.getDay()==1 && today.getDate()>14 && today.getDate()<=21){ //Washington's Birthday
			theHoliday=addDays(today,0);
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==4 && today.getDay()==1 && today.getDate()>21){ //Memorial Day
			theHoliday=addDays(today,0);
			if(bEarlyMemorialDay) result.pop();
			result.push(theHoliday.getTime());
			bEarlyMemorialDay=true;
		}else if(today.getMonth()==5 && today.getDate()==19){ //Juneteenth 
			if(today.getDay()==0){
				theHoliday=addDays(today,1);
			}else if(today.getDay()==6){
				theHoliday=addDays(today,-1);
			}else{
				theHoliday=addDays(today,0);
			}
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==6 && today.getDate()==4){ //Independence Day
			if(today.getDay()==0){
				theHoliday=addDays(today,1);
			}else if(today.getDay()==6){
				theHoliday=addDays(today,-1);
			}else{
				theHoliday=addDays(today,0);
			}
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==8 && today.getDay()==1 && today.getDate()<=7){ //Labor Day
			theHoliday=addDays(today,0);
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==9 && today.getDay()==1 && today.getDate()>7 && today.getDate()<=14){ //Columbus Day
			theHoliday=addDays(today,0);
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==10 && today.getDate()==11){ //Veterans Day
			if(today.getDay()==0){
				theHoliday=addDays(today,1);
			}else if(today.getDay()==6){
				theHoliday=addDays(today,-1);
			}else{
				theHoliday=addDays(today,0);
			}
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==10 && today.getDay()==4 && today.getDate()>21 && today.getDate()<=28){ //Thanksgiving Day
			theHoliday=addDays(today,0);
			result.push(theHoliday.getTime());
		}else if(today.getMonth()==11 && today.getDate()==25){ //Christmas Day
			if(today.getDay()==0){
				theHoliday=addDays(today,1);
			}else if(today.getDay()==6){
				theHoliday=addDays(today,-1);
			}else{
				theHoliday=addDays(today,0);
			}
			result.push(theHoliday.getTime());
		}
		today=addDays(today,1);
	}
	return result;
}

function addDays(theDate, numberOfDays) {
   	var result = new Date(theDate);
	result.setDate(result.getDate() + numberOfDays);
	return result;
}

function resetTables(){
	if(m_teams.length>1) document.getElementById("rdoAll").checked="checked";
	for(var m=0; m < 12; m++){
		var t=document.getElementById("m"+m);
		t.value=t.defaultValue;
		for (var w=0; w < 6; w++){
			var r=document.getElementById("m"+m + ".w"+w);
			r.value=r.defaultValue;
			for (var d=0; d< 7; d++){
				var c=document.getElementById("m"+m + ".w"+w + ".d"+d);
				c.value=c.defaultValue;
				c.innerHTML="";
				c.style.backgroundColor="";
				c.style.color="";
				c.style.border="";
				while (c.firstChild) c.removeChild(c.firstChild);
			}
		}
	}
	window.scrollTo(0,0);
}

function btnYearPrev_click(){
	var btn=document.getElementById("btnYearPrev"), lblYear=document.getElementById("lblYear");
	var theYear=new Date(lblYear.innerText,0,1);
	if (theYear.getFullYear()>2016){
		theYear.setFullYear(theYear.getFullYear()-1);
		lblYear.innerText=theYear.getFullYear();
		calendarInitialize();
	}else{
		btn.style.color = "#BBBEBD";
	}
}

function btnYearNext_click(){
	var btn=document.getElementById("btnYearNext"), lblYear=document.getElementById("lblYear");
	var thisYear=new Date(lblYear.innerText,0,1);
	var nextYear= new Date(thisYear.getFullYear()+1,0,1);
	document.getElementById("lblYear").innerText=nextYear.getFullYear();
	document.getElementById("btnYearPrev").style.color = "";
	calendarInitialize();
}

function rdoTeams_click(){
	var pick, rdoTeams=document.getElementsByName("rdoTeams");
	for (var i=0; i<rdoTeams.length; i++){
		if(rdoTeams[i].checked){
			pick=rdoTeams[i].value;
			break;
		}
	}
	switch(pick){
		case "blue":
			m_teams=["blue"];
			break;
		case "green":
			m_teams=["green"];
			break;
		case "red":
			m_teams=["red"];
			break;
		case "purple":
			m_teams=["purple"];
			break;
		default:
			m_teams=["blue","green","red","purple"];
			break;
		
	}
	calendarInitialize();
}

function getCurrentYear(){
	var d, lblYear = document.getElementById("lblYear");
	if (lblYear.innerText.length != 4){
		var today=new Date();
		d= new Date(today.getFullYear(),0,1);
	}else{
		d=new Date(lblYear.innerText,0,1);
	}
	lblYear.innerText=d.getFullYear();
	return d;
}

function right(str, chr){
	return str.slice(-(chr));
}

function left(str, chr){
	return str.slice(0, chr);
}