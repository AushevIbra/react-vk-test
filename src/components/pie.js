import React, { Component } from 'react';
import { Tabs } from 'antd';
import { Pie } from 'react-chartjs-2';
import firebase from 'firebase';
import axios from 'axios-jsonp-pro';
const TabPane = Tabs.TabPane;

class StatsPie extends Component {
    
        constructor(props)
        {
            super(props)
           
        }
        componentDidMount(){
            //console.log(this.state)
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
           // console.log(new Date('yyyy-mm-dd'))
              
              let id1 = this.props.id.length > 4 ? String(this.props.id) : Number(this.props.id) ;
              //console.log('117779476'.length)
              const db = firebase.database();
              const id = db.ref().child('stats_pie').orderByChild('id').equalTo(ref.props.id).on('value', snap => {
                  let labels_city = [];
                  let count_city = [];
                if(snap.val() == null) {
                    console.log(snap.val());
                    axios.jsonp("https://api.vk.com/method/stats.get?group_id=" + ref.props.id+ "&date_from=" + date.yyyymmdd() +"&access_token=bc4c409ebd2832cabce26cc720e63373f587b78c9998044c17f3833de17232c8667e2cb340c4ebd0d609f&v=5.85").then(data => {
                        // console.log(data.response[1].visitors.sex[0].value)
                        let count_m =0, count_f = 0;
                        let count_countries = [], labels_city = [];
                        for(let i=1; i< data.response.length; i++) {
                            
                            count_f += data.response[i].visitors.sex[0].count;
                            count_m += data.response[i].visitors.sex[1].count;

                            for(let j =0; j < 5; j++) {
                                if(labels_city.indexOf(data.response[i].visitors.countries[j]['code']) == -1)
                                {
                                    labels_city.push(data.response[i].visitors.countries[j]['code']);
                                    count_countries.push(data.response[i].visitors.countries[j]['count'])


                                }else {
                                    count_countries[j] += data.response[i].visitors.countries[j]['count'];
                                }
                                if(j == 4) break
                            

                            }
                        }
                    
                        
                        firebase.database().ref().child('stats_pie').push({
                            id: ref.props.id,
                            dataOne:{
                                label_f: 'f',
                                data_f: count_f,
                                label_m: 'm',
                                data_m: count_m,
                           },
                           dataSecond: {
                               labels_city: labels_city,
                               count_countries: count_countries
                           }

                        });
                        ref.setState({
                            id: ref.props.id,
                            
                            dataOne: {
                            labels: ['f','m'],
                            datasets: [{
                                data: [count_f,count_m],
                                backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                              
                                ],
                                hoverBackgroundColor: [
                                '#FF6384',
                                '#36A2EB',]
                            }]
                            },
                            dataSecond: {
                                labels: labels_city,
                            datasets: [{
                                data: count_countries,
                                backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                              
                                ],
                                hoverBackgroundColor: [
                                '#FF6384',
                                '#36A2EB',]
                            }]
                            }
                        })
     
                    }).catch(error => {
                        console.log(error)
                    })
                } 
                else { 
                    const key = Object.keys(snap.val());
                    ref.setState({
                        id: snap.val()[key[0]].id,
                        
                        dataOne: {
                        labels: [snap.val()[key[0]]['dataOne'].label_f,snap.val()[key[0]]['dataOne'].label_m],
                        datasets: [{
                            data: [snap.val()[key[0]]['dataOne'].data_f,snap.val()[key[0]]['dataOne'].data_m],
                            backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                          
                            ],
                            hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB',                            ]
                        }]
                        },
                        dataSecond: {
                            labels: snap.val()[key[0]]['dataSecond'].labels_city,
                        datasets: [{
                            data: snap.val()[key[0]]['dataSecond'].count_countries,
                            backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                          
                            ],
                            hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB',]
                        }]
                        }    
                    })
                    
                }
                    
            });
           
     
        }
    
    callback = (key) => {
        console.log(key);
    }
    
    render() {
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="Visitors" key="1">
                     {this.state ? <Pie data={this.state.dataOne} /> : null}
                    </TabPane>
                    <TabPane tab="GEO" key="2">
                    {this.state ? <Pie data={this.state.dataSecond} /> : null}
                    </TabPane>
                </Tabs>
                
            </div>
        )
    }
}

export default StatsPie;
