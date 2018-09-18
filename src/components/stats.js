import React, { Component } from 'react';
import StatsLine from './line';
import InfoGroup from './info_group';
import StatsPie from './pie';
import { Row, Col } from 'antd';

class Stats extends Component {
    
    
    render() {
        return (
            <div>
                <Row>
                    <Col span={8}>
                    <InfoGroup id={this.props.match.params.id} />
                    </Col>
                    <Col span={8}>
                    
                    <StatsPie id={this.props.match.params.id}  />
                    </Col>
                    <Col span={8}>
                    
                    <StatsLine id={this.props.match.params.id} />
                    </Col>
                </Row>
                
                
                
            </div>
        )
    }
}

export default Stats;
