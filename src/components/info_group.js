import React, { Component } from 'react';
import axios from 'axios-jsonp-pro';
import firebase from 'firebase';
import { Card } from 'antd';

const { Meta } = Card;
class InfoGroup extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            members_count: '',
            photo_100: '', 
        }
    }
    componentDidMount() {
        const ref = this;
        //let id1 = this.props.id.length > 4 ? String(this.props.id) : Number(this.props.id) ;
        const db = firebase.database();
        const id = db.ref().child('info_group').orderByChild('id').equalTo(ref.props.id).on('value', snap => {
            if(snap.val() == null){
            axios.jsonp('https://api.vk.com/method/groups.getById?group_id=' + ref.props.id +'&fields=description,members_count&access_token=bc4c409ebd2832cabce26cc720e63373f587b78c9998044c17f3833de17232c8667e2cb340c4ebd0d609f&v=5.85')
                .then(data => {
                    const { response } = data;
                    const fDate = {
                        id: ref.props.id,
                        name: response[0].name,
                        description: response[0].description,
                        members_count: response[0].members_count,
                        photo_100: response[0].photo_100,
                    };
                     db.ref().child('info_group').push(fDate)
                     ref.setState(fDate, console.log(fDate))
                }).catch(error => {
                    console.log(error)
                })
            }
            else {
                
                const key = Object.keys(snap.val());
                ref.setState({
                     id: snap.val()[key[0]].id,
                     name: snap.val()[key[0]].name,
                     description: snap.val()[key[0]].description,
                     members_count: snap.val()[key[0]].members_count,
                     photo_100: snap.val()[key[0]].photo_100,
                })
            }
        })

        
    }
    render() {
        return (
            <div>
                {this.state.id == '' ? <span>Загрузка...</span> : <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img alt="example" src={this.state.photo_100} />}
  >
    <Meta
      title={this.state.name}
      description={String(this.state.description).substring(0,100) + '...'}
    />
    <hr />
    <div>Кол-во подписчиков: {this.state.members_count}</div>
  </Card>}
            </div>
        )
    }
}

export default InfoGroup;
