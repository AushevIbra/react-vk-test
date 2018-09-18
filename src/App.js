import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Input, Button } from 'antd';



class App extends Component {
  state = {
    id: 1
  }

  handleChange = (e) => {
    this.setState({id:e.target.value})
   // console.log(this.input)
  }
  render() {
    return (
      <div className="App">
      <Row>
        <Col span={12} offset={6}>
        <div style={{ marginBottom: 16, display: 'flex' }}>
          <Input addonBefore="ID группы" addonAfter="" onChange={this.handleChange} defaultValue="1" />
          <Button onClick={() => {this.props.history.push(`/stats/${this.state.id}`)}}>Отправить</Button>
        </div>
        </Col>
      </Row>
      
      </div>
    );
  }
}

export default App;
