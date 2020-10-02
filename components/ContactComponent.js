import React, {Component} from 'react';
import {Card} from 'react-native-elements';
import {Text} from 'react-native';
import * as Animatable from 'react-native-animatable';

export class Contact extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>                
        <Card title='Contact Information'>
        <Text>
          {`121, Clear Water Bay Road
          Clear Water Bay, Kowloon
          HONG KONG
          Tel: +852 1234 5678
          Fax: +852 8765 4321
          Email:confusion@food.net`}
        </Text>
        </Card>
      </Animatable.View>
    )
  }
}

export default Contact;