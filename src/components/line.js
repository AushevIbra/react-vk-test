import React, { Component } from 'react';
import firebase from 'firebase';
import axios from 'axios-jsonp-pro';
import {Line} from 'react-chartjs-2';
import { Row, Col, DatePicker } from 'antd';
const { RangePicker } = DatePicker;

class StatsLine extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            load: false,
        };
    }
    componentDidMount(){
        //console.log(this.state)
        let label = [];
        let setData = [];
        const ref = this;
        Date.prototype.yyyymmdd = function() {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
          
            return [this.getFullYear(),
                    (mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd
                   ].join('-');
          };
          var dateOffset = (24*60*60*1000) * 30; //5 days
          
          var date = new Date();
          date.setTime(date.getTime() - dateOffset);
          console.log(date.yyyymmdd())
       // console.log(new Date('yyyy-mm-dd'))
          
          let id1 = this.props.id.length > 4 ? String(this.props.id) : Number(this.props.id) ;
          //console.log('117779476'.length)
          const db = firebase.database();
          const id = db.ref().child('stats').orderByChild('id').equalTo(id1).on('value', snap => {
            if(snap.val() == null) {
                console.log(snap.val());
                axios.jsonp("https://api.vk.com/method/stats.get?group_id=" + ref.props.id + "&date_from=" + date.yyyymmdd() +"&access_token=bc4c409ebd2832cabce26cc720e63373f587b78c9998044c17f3833de17232c8667e2cb340c4ebd0d609f&v=5.85").then(data => {
                    //console.log(data)
                    
                    for(let i=0; i< data.response.length; i++) {
                        label.push(data.response[i].period_from);
                        if(data.response[i].activity.subscribed)
                            setData.push(data.response[i].activity.subscribed);
                    }
                    //console.log(setData);
                    ref.setState({
                        labels: label.reverse(),
                        datasets: [
                          {
                            label: 'Рост подписок по дням',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: setData.reverse()
                          }
                        ],
                        load: true,
                        id: ref.props.id,
                        
                    })
                    firebase.database().ref().child('stats').push({
                        id: ref.props.id,
                        labels: label,
                        data: setData
                    });
                }).catch(error => {
                    console.log(error)
                })
            } 
            else { 
                //alert(213)
                const key = Object.keys(snap.val());
                console.log()
                ref.setState({
                    labels: snap.val()[key[0]]['labels'].reverse(),
                    datasets: [
                      {
                        label: 'Рост подписок по дням',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: snap.val()[key[0]]['data'].reverse()
                      }
                    ],
                    load: true,
                    //id: ref.props.id,
                    
                })
            }
                
        });
       
 
    }
    onChange = (date, dateString) =>  {
        console.log(dateString);
    }
    render() {
        return (
            <div>
                                
                
                        {this.state.load == false ? <span></span> : 
                        <div>
                        <Line data={this.state} />
                        </div>
                        
                        }
                        
                  
            </div>
        )
    }
}

export default StatsLine;
