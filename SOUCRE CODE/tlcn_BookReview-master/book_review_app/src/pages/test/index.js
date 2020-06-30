import React, { Component,useState, useEffect }  from 'react';
// import Data from './src/pages/test';
import {Card,Typography,Button} from 'antd';
import { QuizData} from './quizdata'
import './index.scss'
const { Paragraph } = Typography;
export class QuizApp extends Component{
  
    state = {
        currentQuestion: 0,
        myAnswer: null,
        options: [],
        score: 0,
        disabled: true,
        isEnd: false
    };
    loadQuizData = () => {
        // console.log(quizData[0].question)
        this.setState(() => {
          return {
            questions: QuizData[this.state.currentQuestion].question,
            answer: QuizData[this.state.currentQuestion].answer,
            options: QuizData[this.state.currentQuestion].options
          };
        });
      };
    componentDidMount() {
        this.loadQuizData();
      }
    nextQuestionHandler = () => {
        // console.log('test')
        const { myAnswer, answer, score } = this.state;

        if (myAnswer === answer) {
        this.setState({
            score: score + 1
        });
        }
        this.setState({
        currentQuestion: this.state.currentQuestion + 1
        });
        console.log(this.state.currentQuestion);
    };
    backQuestionHandler = () => {
      const { myAnswer, answer, score } = this.state;
      this.setState({
      currentQuestion: this.state.currentQuestion - 1
      });
  };
    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentQuestion !== prevState.currentQuestion) {
          this.setState(() => {
            return {
              disabled: true,
              questions: QuizData[this.state.currentQuestion].question,
              options: QuizData[this.state.currentQuestion].options,
              answer: QuizData[this.state.currentQuestion].answer
            };
          });
        }
    }
    //check answer
    checkAnswer = answer => {
        this.setState({ myAnswer: answer, disabled: false });
    };
    finishHandler = () => {
        if (this.state.currentQuestion === QuizData.length - 1) {
        this.setState({
            isEnd: true
        });
        }
        if (this.state.myAnswer === this.state.answer) {
        this.setState({
            score: this.state.score + 1
        });
        }
    };
    render(){
        const { options, myAnswer, currentQuestion, isEnd } = this.state;
        return(
            <div className='App'>
            <h1>Bài thi thử TOIEC online</h1>
            <div className='part'>
              <Button type="dashed" >
                Part 1
              </Button>
              <Button type="dashed" >
                Part 2
              </Button>
              <Button type="dashed" >
                Part 3
              </Button>
              <Button type="dashed" >
                Part 4
              </Button>
              <Button type="dashed" >
                Part 5
              </Button>
              <Button type="dashed" >
                Part 6
              </Button>
              <Button type="dashed" >
                Part 7
              </Button>
            </div>
            <Card className='card' title='Part I: Picture Description' bordered={false} style={{ width: 500 }}>
              <Paragraph>
              Directions: For each question, you will see a picture and you will hear four short statements. The statements will be spoken just one time. They will not be printed in your test book so you must listen carefully to understand what the speaker says. When you hear the four statements, look at the picture and choose the statement that best describes what you see in the picture. Choose the best answer A, B, C or D.
              </Paragraph>
                <p>
                {<h1>{this.state.questions} </h1>}
                <span>{`Questions ${currentQuestion}  out of ${QuizData.length -1} remaining `}</span>
                {
                    options.map(option => (
                        <p key={option.id} className={`ui floating message options ${myAnswer === option ? "selected" : null}`}
                        onClick={() => this.checkAnswer(option)}
                        >
                        {option}
                        </p>
                    ))
                }
                {currentQuestion < QuizData.length  && (
                  <button
                    className="ui inverted button"
                   // disabled={this.state.disabled}
                    onClick={this.nextQuestionHandler}
                  >
                    Next
                  </button>
                )}
                {currentQuestion < QuizData.length+1 && (
                  <button
                    className="ui inverted button"
                    //disabled={this.state.disabled}
                    onClick={this.backQuestionHandler}
                  >
                    Back
                  </button>
                )}
                {currentQuestion === QuizData.length - 1 && (
                  <button className="ui inverted button" onClick={this.finishHandler}>
                    Finish
                  </button>
                )}
                </p>
              </Card>
                
            </div>
            
        ) }
}
export default QuizApp;