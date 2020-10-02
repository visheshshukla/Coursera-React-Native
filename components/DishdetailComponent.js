import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button} from 'react-native';
import { Card, Icon, Rating, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment, date) =>
    dispatch(postComment(dishId, rating, author, comment, date))
})

const RenderDish = (props) => {
    const dish = props.dish
  
    if (dish != null) {
      return (
        <Card
          featuredTitle={dish.name}
          image={{uri: baseUrl + dish.image}}
        >
          <Text style={{margin: 10}}>{dish.description}</Text>
          <View style={styles.buttons}>
          <Icon
            raised
            reverse
            name={props.favorite ? 'heart' : 'heart-o'}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite
                ? console.log('already favorites')
                : props.addFavorite()
            }
          />
          <Icon
            raised
            reverse
            name={'pencil'}
            type="font-awesome"
            color="#512da8"
            onPress={() => props.toggleModal()}
          />
        </View>
        </Card>
      )
    } else {
      return <View></View>
    }
  }

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                imageSize={10}
                readonly
                startingValue={item.rating}
                style={styles.rating}
                />
                <Text style={{fontSize: 12}}> {'-- ' + item.author + ' ,' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      rating: 5,
      author: '',
      comment: '',
    }
    this.handleRating = this.handleRating.bind(this)
    this.handleComment = this.handleComment.bind(this)
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
      this.props.postFavorite(dishId)
    }
  
    toggleModal() {
      this.setState(state => ({showModal: !state.showModal}))
    }
  
    handleRating(rating) {
      this.setState({
        rating: rating,
      })
    }
  
    handleComment(dishId) {
      const {rating, author, comment} = this.state
      this.props.postComment(dishId, rating, author, comment, new Date())
      this.toggleModal()
    }
  
    resetForm() {
      this.setState({rating: 5, author: '', comment: ''})
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          addFavorite={() => this.markFavorite(dishId)}
          toggleModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.toggleModal()
          }}
          onRequestClose={() => {
            this.toggleModal()
          }}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              minValue={1}
              ratingCount={5}
              startingValue={5}
              onFinishRating={e => this.handleRating(e)}
            />
            <Input
              style={styles.formRow}
              placeholder=" Author"
              leftIcon={{type: 'font-awesome', name: 'user-o'}}
              onChangeText={text => this.setState({author: text})}
            />
            <Input
              placeholder=" Comment"
              style={styles.formRow}
              leftIcon={{type: 'font-awesome', name: 'comment-o'}}
              onChangeText={text => this.setState({comment: text})}
            />

            <Button
              style={styles.formRow}
              onPress={() => {
                this.handleComment(dishId)
              }}
              color="#512da8"
              title="Submit"
            />
            <Button
              style={styles.formRow}
              onPress={() => {
                this.toggleModal()
              }}
              color="#8f8f8f"
              title="Close"
            />
          </View>
        </Modal>
      </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 30,
  },

  modal: {
    justifyContent: 'center',
    margin: 20,
  },

  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
  rating: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);